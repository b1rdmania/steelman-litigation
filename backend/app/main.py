"""Premotion — FastAPI backend entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import FRONTEND_URL
from .database import init_db
from .routers import cases, demo
from .services.seed import seed_demos


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    seed_demos()
    yield


app = FastAPI(
    title="Premotion API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"],
    # Allow the steelman-liard alias and any preview deploy under this project
    # (steelman-<hash>-boom-test-c54cde04.vercel.app, steelman-liard.vercel.app, etc.)
    allow_origin_regex=r"https://steelman-[a-z0-9-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router)
app.include_router(demo.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "premotion"}
