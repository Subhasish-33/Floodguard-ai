"""FloodGuard AI FastAPI entrypoint — simulation contracts + future ML hooks."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import simulation, intelligence

app = FastAPI(title="FloodGuard Simulation API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation.router, prefix="/api")
app.include_router(intelligence.router, prefix="/api")

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "floodguard-simulation"}
