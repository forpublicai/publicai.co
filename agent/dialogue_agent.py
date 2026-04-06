"""
Swiss National AI Dialogue — LiveKit Voice Agent

This agent conducts the same qualitative interview as the text-based dialogue,
but using voice via a STT-LLM-TTS pipeline. It is deployed separately from
the Vercel frontend and dispatched via the livekit-token API route.

Usage:
  uv run dialogue_agent.py dev       # development
  uv run dialogue_agent.py start     # production
  lk agent deploy                    # deploy to LiveKit Cloud
"""

import json
from pathlib import Path

from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, room_io, TurnHandlingOptions
from livekit.plugins import silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")

# Load the same interview prompt used by the text-based API route
PROMPT_PATH = Path(__file__).parent / "interview_prompt.md"
BASE_INSTRUCTIONS = PROMPT_PATH.read_text(encoding="utf-8")

LANGUAGE_NAMES = {
    "de": "German",
    "fr": "French",
    "it": "Italian",
    "en": "English",
}


class DialogueInterviewer(Agent):
    """Apertus voice interviewer for the Swiss National AI Dialogue."""

    def __init__(self, language: str = "en") -> None:
        lang_name = LANGUAGE_NAMES.get(language, "English")
        language_directive = (
            f"IMPORTANT: Respond entirely in {lang_name}. Do not ask about language preference.\n\n"
        )
        voice_directive = (
            "You are now in voice mode. Keep responses concise and conversational — "
            "shorter than you would in text. For structured [[Option]] questions, "
            "present the options as a numbered list and ask the participant to say "
            "the number or describe their choice.\n\n"
        )

        super().__init__(
            instructions=language_directive + voice_directive + BASE_INSTRUCTIONS,
        )


server = AgentServer()


@server.rtc_session(agent_name="dialogue-agent")
async def dialogue_session(ctx: agents.JobContext):
    # Read language from agent dispatch metadata
    language = "en"
    if ctx.agent and ctx.agent.metadata:
        try:
            meta = json.loads(ctx.agent.metadata)
            language = meta.get("language", "en")
        except (json.JSONDecodeError, TypeError):
            pass

    session = AgentSession(
        stt="deepgram/nova-3:multi",
        llm="openai/gpt-4.1-mini",
        tts="cartesia/sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        vad=silero.VAD.load(),
        turn_handling=TurnHandlingOptions(
            turn_detection=MultilingualModel(),
        ),
    )

    await session.start(
        room=ctx.room,
        agent=DialogueInterviewer(language=language),
    )

    await session.generate_reply(
        instructions="Greet the participant briefly. You are Apertus, the Swiss public AI. "
        "Welcome them to the Swiss National AI Dialogue and begin the interview."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
