from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from steelflow_db.core.db import get_db
from app.services.material_request import MaterialRequestService
from app.schemas.schemas import MaterialRequestCreate, MaterialRequestResponse
from uuid import UUID
from typing import List, Optional

router = APIRouter(prefix="/material-requests", tags=["Material Requests"])

@router.get("", response_model=List[MaterialRequestResponse])
def get_material_requests(db: Session = Depends(get_db)):
    service = MaterialRequestService(db)
    return service.get_all()

@router.get("/project/{project_id}", response_model=List[MaterialRequestResponse])
def get_project_requests(project_id: UUID, db: Session = Depends(get_db)):
    service = MaterialRequestService(db)
    return service.get_by_project(project_id)

@router.post("", response_model=MaterialRequestResponse, status_code=status.HTTP_201_CREATED)
def raise_request(payload: MaterialRequestCreate, db: Session = Depends(get_db)):
    service = MaterialRequestService(db)
    return service.raise_request(payload)

@router.post("/approve/{request_id}", response_model=MaterialRequestResponse)
def approve_request(
    request_id: UUID, 
    approved_qty: Optional[float] = None, 
    reviewed_by: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    service = MaterialRequestService(db)
    req = service.approve_request(request_id, approved_qty, reviewed_by)
    if not req:
        raise HTTPException(status_code=400, detail="Material request not found or not in Pending status")
    return req

@router.post("/reject/{request_id}", response_model=MaterialRequestResponse)
def reject_request(request_id: UUID, reviewed_by: Optional[str] = None, db: Session = Depends(get_db)):
    service = MaterialRequestService(db)
    req = service.reject_request(request_id, reviewed_by)
    if not req:
        raise HTTPException(status_code=400, detail="Material request not found or not in Pending status")
    return req
