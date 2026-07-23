from sqlalchemy.orm import Session
from app.models import MaterialRequest
from app.repositories.base import BaseRepository
from uuid import UUID
from typing import List

class MaterialRequestRepository(BaseRepository[MaterialRequest]):
    def __init__(self, db: Session):
        super().__init__(MaterialRequest, db)
        
    def get_by_number(self, request_number: str) -> MaterialRequest:
        return self.db.query(MaterialRequest).filter(
            MaterialRequest.request_number == request_number
        ).first()

    def get_by_project(self, project_id: UUID) -> List[MaterialRequest]:
        return self.db.query(MaterialRequest).filter(
            MaterialRequest.project_id == project_id
        ).all()

    def get_pending(self) -> List[MaterialRequest]:
        return self.db.query(MaterialRequest).filter(
            MaterialRequest.status == "Pending"
        ).all()
