from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from steelflow_db.core.db import get_db
from app.services.warehouse import WarehouseService
from app.schemas.schemas import WarehouseCreate, WarehouseUpdate, WarehouseResponse
from uuid import UUID
from typing import List

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])

@router.get("", response_model=List[WarehouseResponse])
def get_warehouses(db: Session = Depends(get_db)):
    service = WarehouseService(db)
    return service.get_all()

@router.post("", response_model=WarehouseResponse, status_code=status.HTTP_201_CREATED)
def create_warehouse(payload: WarehouseCreate, db: Session = Depends(get_db)):
    service = WarehouseService(db)
    return service.create(payload)

@router.put("/{warehouse_id}", response_model=WarehouseResponse)
def update_warehouse(warehouse_id: UUID, payload: WarehouseUpdate, db: Session = Depends(get_db)):
    service = WarehouseService(db)
    warehouse = service.update(warehouse_id, payload)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return warehouse

@router.delete("/{warehouse_id}")
def delete_warehouse(warehouse_id: UUID, db: Session = Depends(get_db)):
    service = WarehouseService(db)
    success = service.delete(warehouse_id)
    if not success:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return {"message": "Warehouse deleted successfully"}
