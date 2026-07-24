from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    materials,
    warehouses,
    inventory,
    goods_receipts,
    reservations,
    material_requests,
    transactions
)
from steelflow_db.core.db import engine
from steelflow_db.core.base import Base
from app.models import * # Import all models so they register with Base.metadata

# Create any missing database tables on startup (e.g. inventory_transactions)
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SteelFlowAI - Inventory Management API",
    version="1.0.0",
    description="API for Module 2: Inventory Management"
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

# Register routers under /api/v1
app.include_router(materials.router, prefix="/inventory")
app.include_router(warehouses.router, prefix="/inventory")
app.include_router(inventory.router, prefix="/inventory")
app.include_router(goods_receipts.router, prefix="/inventory")
app.include_router(reservations.router, prefix="/inventory")
app.include_router(material_requests.router, prefix="/inventory")
app.include_router(transactions.router, prefix="/inventory")

@app.get("/")
def root():
    return {
        "message": "SteelFlowAI Inventory Management Backend Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
