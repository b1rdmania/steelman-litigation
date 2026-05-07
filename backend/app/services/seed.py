"""Demo case seeding — validates fixtures on app startup."""

import logging

from .demos import DEMOS

logger = logging.getLogger("premotion.seed")


def seed_demos() -> None:
    """Validate demo fixtures. Demos live in memory, not the DB."""
    for d in DEMOS:
        assert d.get("id"), "demo missing id"
        assert d.get("title"), f"demo {d.get('id')} missing title"
        assert d.get("brief"), f"demo {d.get('id')} missing brief"
        brief = d["brief"]
        for required in (
            "verdict",
            "verdict_reasoning",
            "summary",
            "failure_scenarios",
            "evidence_inconsistencies",
            "blind_spots",
            "if_we_lose_this_will_be_why",
        ):
            assert required in brief, f"demo {d['id']} brief missing {required}"
    logger.info(f"Loaded {len(DEMOS)} demo cases: {[d['id'] for d in DEMOS]}")
