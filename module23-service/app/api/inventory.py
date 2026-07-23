from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from steelflow_db.core.db import get_db
from app.services.inventory import InventoryService
from app.schemas.schemas import InventoryStockResponse, InventoryDashboardResponse
from uuid import UUID
from typing import List, Optional

router = APIRouter(prefix="", tags=["Inventory"])

@router.get("/dashboard", response_model=InventoryDashboardResponse)
def get_inventory_dashboard(db: Session = Depends(get_db)):
    service = InventoryService(db)
    return service.get_dashboard_summary()

@router.get("", response_model=List[InventoryStockResponse])
def get_inventory(db: Session = Depends(get_db)):
    service = InventoryService(db)
    return service.get_all_stock()

@router.get("/material/{material_id}", response_model=List[InventoryStockResponse])
def get_material_stock(material_id: UUID, db: Session = Depends(get_db)):
    service = InventoryService(db)
    return service.get_stock_by_material(material_id)

@router.post("/update", response_model=InventoryStockResponse)
def update_stock(
    material_id: UUID, 
    warehouse_id: UUID, 
    current_stock: float, 
    updated_by: Optional[str] = "System", 
    db: Session = Depends(get_db)
):
    service = InventoryService(db)
    return service.update_stock(material_id, warehouse_id, current_stock, updated_by)
