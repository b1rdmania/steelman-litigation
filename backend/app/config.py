"""Steelman Litigation backend configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

DB_PATH = BASE_DIR / "steelman.db"

# Claude API
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# Per-stage model selection — Opus for adversarial reasoning,
# Sonnet for analysis and synthesis.
OPTIMISTIC_MODEL = os.environ.get("STEELMAN_OPTIMISTIC_MODEL", "claude-sonnet-4-20250514")
EVIDENCE_MODEL = os.environ.get("STEELMAN_EVIDENCE_MODEL", "claude-sonnet-4-20250514")
PREMORTEM_MODEL = os.environ.get("STEELMAN_PREMORTEM_MODEL", "claude-opus-4-20250514")
SYNTHESIS_MODEL = os.environ.get("STEELMAN_SYNTHESIS_MODEL", "claude-sonnet-4-20250514")

# Timeouts (seconds)
SONNET_TIMEOUT = int(os.environ.get("STEELMAN_SONNET_TIMEOUT", "60"))
OPUS_TIMEOUT = int(os.environ.get("STEELMAN_OPUS_TIMEOUT", "120"))

# CORS
FRONTEND_URL = os.environ.get("STEELMAN_FRONTEND_URL", "http://localhost:5173")
