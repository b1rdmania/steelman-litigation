"""SQLite database for Premotion."""

from datetime import datetime, timezone

import aiosqlite
from .config import DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    jurisdiction TEXT DEFAULT 'England & Wales',
    case_type TEXT DEFAULT 'other',
    status TEXT NOT NULL DEFAULT 'submitted',
    partial_analysis INTEGER DEFAULT 0,
    partial_detail TEXT,
    error_detail TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS intakes (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    party_position TEXT NOT NULL,
    current_strategy TEXT NOT NULL,
    desired_outcome TEXT,
    email TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id)
);

CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    upload_type TEXT DEFAULT 'document',
    label TEXT DEFAULT '',
    extracted_text TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id)
);

CREATE TABLE IF NOT EXISTS analyses (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    stage TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    sub_agent_id TEXT,
    model TEXT,
    content_json TEXT NOT NULL,
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id)
);

CREATE TABLE IF NOT EXISTS briefs (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    content_json TEXT NOT NULL,
    verdict TEXT,
    generated_at TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    model TEXT,
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success',
    error_msg TEXT,
    timestamp TEXT NOT NULL
);
"""


async def get_db() -> aiosqlite.Connection:
    db = await aiosqlite.connect(str(DB_PATH), timeout=30)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")
    await db.execute("PRAGMA busy_timeout=10000")
    return db


async def init_db():
    db = await get_db()
    await db.executescript(SCHEMA)
    # Idempotent migrations for existing DBs (CREATE TABLE IF NOT EXISTS
    # won't add new columns to a table that already exists).
    migrations = [
        "ALTER TABLE cases ADD COLUMN partial_analysis INTEGER DEFAULT 0",
        "ALTER TABLE cases ADD COLUMN partial_detail TEXT",
        "ALTER TABLE cases ADD COLUMN error_detail TEXT",
    ]
    for ddl in migrations:
        try:
            await db.execute(ddl)
        except Exception:
            # Column already exists — that's the happy path on subsequent boots.
            pass
    # Janitor: mark any case stuck mid-pipeline as failed. BackgroundTasks
    # don't survive worker restarts (deploys, OOM, idle reaping), so a stuck
    # row would otherwise sit in `analysing_*` forever.
    try:
        await db.execute(
            """UPDATE cases
               SET status = 'failed',
                   error_detail = COALESCE(error_detail, 'Analysis was interrupted by a server restart. Please resubmit.'),
                   updated_at = ?
               WHERE status IN ('submitted', 'analysing_optimistic', 'analysing_evidence', 'analysing_premortem', 'synthesising')
                 AND datetime(updated_at) < datetime('now', '-15 minutes')""",
            (datetime.now(timezone.utc).isoformat(),),
        )
    except Exception:
        pass
    await db.commit()
    await db.close()
