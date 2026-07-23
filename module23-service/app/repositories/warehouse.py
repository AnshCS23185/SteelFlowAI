from sqlalchemy.orm import Session
from app.models import Warehouse
from app.repositories.base import BaseRepository

class WarehouseRepository(BaseRepository[Warehouse]):
    def __init__(self, db: Session):
        super().__init__(Warehouse, db)
        
    def get_by_name(self, name: str) -> Warehouse:
        return self.db.query(Warehouse).filter(Warehouse.name == name).first()
