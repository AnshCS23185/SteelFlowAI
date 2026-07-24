from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Ensure shared_auth is in path for testing
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'shared_auth')))

from app.routers import auth, users, projects, documents, shipping
from app.core.mongo_db import connect_to_mongo, close_mongo_connection

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="SteelFlowAI",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(documents.router)
app.include_router(shipping.router)

@app.get("/")
def root():
    return {
        "message": "SteelFlowAI Backend Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }