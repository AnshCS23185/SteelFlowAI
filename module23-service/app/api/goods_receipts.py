from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from steelflow_db.core.db import get_db
from app.services.goods_receipt import GoodsReceiptService
from app.schemas.schemas import GoodsReceiptCreate, GoodsReceiptResponse
from uuid import UUID
from typing import List

router = APIRouter(prefix="/goods-receipts", tags=["Goods Receipts"])

@router.get("", response_model=List[GoodsReceiptResponse])
def get_goods_receipts(db: Session = Depends(get_db)):
    service = GoodsReceiptService(db)
    return service.get_all()

@router.post("", response_model=GoodsReceiptResponse, status_code=status.HTTP_201_CREATED)
def create_goods_receipt(payload: GoodsReceiptCreate, db: Session = Depends(get_db)):
    service = GoodsReceiptService(db)
    try:
        return service.create(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
