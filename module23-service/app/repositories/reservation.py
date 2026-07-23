from sqlalchemy.orm import Session
from app.models import MaterialReservation
from app.repositories.base import BaseRepository
from uuid import UUID
from typing import List

class ReservationRepository(BaseRepository[MaterialReservation]):
    def __init__(self, db: Session):
        super().__init__(MaterialReservation, db)
        
    def get_by_number(self, reservation_number: str) -> MaterialReservation:
        return self.db.query(MaterialReservation).filter(
            MaterialReservation.reservation_number == reservation_number
        ).first()

    def get_by_project(self, project_id: UUID) -> List[MaterialReservation]:
        return self.db.query(MaterialReservation).filter(
            MaterialReservation.project_id == project_id
        ).all()
