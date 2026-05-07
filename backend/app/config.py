"""Premotion backend configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

DB_PATH = BASE_DIR / "premotion.db"


def _env(*keys, default=""):
    """Read the first env var that's set. Lets us rename
    PREMOTION_* prefixes while honouring legacy STEELMAN_* keys
    already configured on Render."""
    for key in keys:
        v = os.environ.get(key)
        if v is not None and v != "":
            return v
    return default


# Claude API
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# Per-stage model selection — Opus for adversarial reasoning,
# Sonnet for analysis and synthesis.
OPTIMISTIC_MODEL = _env("PREMOTION_OPTIMISTIC_MODEL", "STEELMAN_OPTIMISTIC_MODEL", default="claude-sonnet-4-20250514")
EVIDENCE_MODEL = _env("PREMOTION_EVIDENCE_MODEL", "STEELMAN_EVIDENCE_MODEL", default="claude-sonnet-4-20250514")
PREMORTEM_MODEL = _env("PREMOTION_PREMORTEM_MODEL", "STEELMAN_PREMORTEM_MODEL", default="claude-opus-4-20250514")
SYNTHESIS_MODEL = _env("PREMOTION_SYNTHESIS_MODEL", "STEELMAN_SYNTHESIS_MODEL", default="claude-sonnet-4-20250514")

# Timeouts (seconds)
SONNET_TIMEOUT = int(_env("PREMOTION_SONNET_TIMEOUT", "STEELMAN_SONNET_TIMEOUT", default="60"))
OPUS_TIMEOUT = int(_env("PREMOTION_OPUS_TIMEOUT", "STEELMAN_OPUS_TIMEOUT", default="120"))

# CORS
FRONTEND_URL = _env("PREMOTION_FRONTEND_URL", "STEELMAN_FRONTEND_URL", default="http://localhost:5173")
