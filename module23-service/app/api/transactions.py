from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from steelflow_db.core.db import get_db
from app.services.transaction import TransactionService
from app.schemas.schemas import InventoryTransactionResponse
from uuid import UUID
from typing import List, Optional

router = APIRouter(prefix="/transactions", tags=["Inventory Transactions"])

@router.get("", response_model=List[InventoryTransactionResponse])
def get_transactions(limit: int = 100, db: Session = Depends(get_db)):
    service = TransactionService(db)
    return service.get_all(limit)

@router.get("/material/{material_id}", response_model=List[InventoryTransactionResponse])
def get_material_transactions(material_id: UUID, db: Session = Depends(get_db)):
    service = TransactionService(db)
    return service.get_by_material(material_id)
