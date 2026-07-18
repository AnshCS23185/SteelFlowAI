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

app = FastAPI(
    title="SteelFlowAI - Inventory Management API",
    version="1.0.0",
    description="API for Module 2: Inventory Management"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(materials.router, prefix="/api")
app.include_router(warehouses.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")
app.include_router(goods_receipts.router, prefix="/api")
app.include_router(reservations.router, prefix="/api")
app.include_router(material_requests.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")

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