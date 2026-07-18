from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from steelflow_db.core.db import get_db
from app.services.reservation import ReservationService
from app.schemas.schemas import MaterialReservationCreate, MaterialReservationResponse, MaterialRequestResponse
from uuid import UUID
from typing import List, Optional

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.get("", response_model=List[MaterialReservationResponse])
def get_reservations(db: Session = Depends(get_db)):
    service = ReservationService(db)
    return service.get_all()

@router.get("/project/{project_id}", response_model=List[MaterialReservationResponse])
def get_project_reservations(project_id: UUID, db: Session = Depends(get_db)):
    service = ReservationService(db)
    return service.get_by_project(project_id)

@router.post("/reserve")
def reserve_material(payload: MaterialReservationCreate, db: Session = Depends(get_db)):
    service = ReservationService(db)
    result = service.reserve_material(payload)
    # The result may return a reservation or a shortage request
    return {
        "success": result["success"],
        "reservation": MaterialReservationResponse.from_orm(result["reservation"]) if result["reservation"] else None,
        "request": MaterialRequestResponse.from_orm(result["request"]) if result["request"] else None,
        "shortage": result["shortage"]
    }

@router.post("/release/{reservation_id}")
def release_reservation(reservation_id: UUID, db: Session = Depends(get_db)):
    service = ReservationService(db)
    success = service.release_reservation(reservation_id)
    if not success:
        raise HTTPException(status_code=400, detail="Unable to release reservation. It may not exist or is already released.")
    return {"message": "Reservation released successfully"}
