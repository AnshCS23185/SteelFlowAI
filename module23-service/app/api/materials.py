from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from steelflow_db.core.db import get_db
from app.services.material import MaterialService
from app.schemas.schemas import MaterialCreate, MaterialUpdate, MaterialResponse
from uuid import UUID
from typing import List

router = APIRouter(prefix="/materials", tags=["Materials"])

@router.get("", response_model=List[MaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    service = MaterialService(db)
    return service.get_all()

@router.post("", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
def create_material(payload: MaterialCreate, db: Session = Depends(get_db)):
    service = MaterialService(db)
    existing = service.get_by_sku(payload.sku)
    if existing:
        raise HTTPException(status_code=400, detail="Material with this SKU already exists")
    return service.create(payload)

@router.put("/{material_id}", response_model=MaterialResponse)
def update_material(material_id: UUID, payload: MaterialUpdate, db: Session = Depends(get_db)):
    service = MaterialService(db)
    material = service.update(material_id, payload)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@router.delete("/{material_id}")
def delete_material(material_id: UUID, db: Session = Depends(get_db)):
    service = MaterialService(db)
    success = service.delete(material_id)
    if not success:
        raise HTTPException(status_code=404, detail="Material not found")
    return {"message": "Material deleted successfully"}
