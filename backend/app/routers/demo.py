"""Demo router — read-only endpoints for hard-coded sample cases."""

from fastapi import APIRouter, HTTPException

from ..services.demos import get_demo, list_demos


router = APIRouter()


@router.get("/api/demo")
async def list_demo_cases():
    return {"demos": list_demos()}


@router.get("/api/demo/{demo_id}")
async def get_demo_case(demo_id: str):
    demo = get_demo(demo_id)
    if not demo:
        raise HTTPException(status_code=404, detail="Demo not found")
    return demo
