"""Base agent class — wraps Claude API calls with logging, timeouts, JSON parsing."""

import json
import time
import uuid
from datetime import datetime, timezone

import anthropic

from ..config import ANTHROPIC_API_KEY
from ..database import get_db


client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


class AgentResult:
    def __init__(self, data: dict, tokens_in: int = 0, tokens_out: int = 0, duration_ms: int = 0):
        self.data = data
        self.tokens_in = tokens_in
        self.tokens_out = tokens_out
        self.duration_ms = duration_ms


class BaseAgent:
    """Per-class model and timeout — subclasses override with one line each.
    This is what gives Premotion its multi-model architecture without a routing layer."""

    agent_id: str = "base"
    sub_agent_id: str | None = None
    stage: str = "unknown"
    model: str = "claude-sonnet-4-20250514"
    timeout: int = 60
    max_tokens: int = 8192

    def build_system_prompt(self) -> str:
        raise NotImplementedError

    def build_user_prompt(self, input_data: dict) -> str:
        raise NotImplementedError

    def parse_response(self, text: str) -> dict:
        """Pull a JSON block out of the model response."""
        if "```json" in text:
            start = text.index("```json") + 7
            end = text.index("```", start)
            text = text[start:end].strip()
        elif "```" in text:
            start = text.index("```") + 3
            end = text.index("```", start)
            text = text[start:end].strip()
        return json.loads(text)

    async def execute(self, input_data: dict, case_id: str) -> AgentResult:
        system_prompt = self.build_system_prompt()
        user_prompt = self.build_user_prompt(input_data)

        start_time = time.time()
        error_msg = None
        status = "success"
        tokens_in = 0
        tokens_out = 0
        result_data: dict = {}
        raw_text = ""

        try:
            response = await client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
                timeout=self.timeout,
            )
            tokens_in = response.usage.input_tokens
            tokens_out = response.usage.output_tokens
            raw_text = response.content[0].text
            result_data = self.parse_response(raw_text)
        except json.JSONDecodeError as e:
            status = "failed"
            error_msg = f"Failed to parse JSON response: {e}"
            result_data = {"error": error_msg, "raw": raw_text}
        except anthropic.APITimeoutError:
            status = "timeout"
            error_msg = f"Agent {self.agent_id} timed out after {self.timeout}s"
            result_data = {"error": error_msg}
        except Exception as e:
            status = "failed"
            error_msg = str(e)
            result_data = {"error": error_msg}

        duration_ms = int((time.time() - start_time) * 1000)

        # Audit log — every call traced independently
        db = await get_db()
        try:
            await db.execute(
                """INSERT INTO audit_log
                   (id, case_id, agent_id, model, tokens_in, tokens_out, duration_ms,
                    status, error_msg, timestamp)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    str(uuid.uuid4()),
                    case_id,
                    self.sub_agent_id or self.agent_id,
                    self.model,
                    tokens_in,
                    tokens_out,
                    duration_ms,
                    status,
                    error_msg,
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
            await db.commit()
        finally:
            await db.close()

        if status != "success":
            raise RuntimeError(f"{self.agent_id}: {error_msg}")

        return AgentResult(
            data=result_data,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            duration_ms=duration_ms,
        )
