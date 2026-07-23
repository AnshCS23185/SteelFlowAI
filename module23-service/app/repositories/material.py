from sqlalchemy.orm import Session
from app.models import Material
from app.repositories.base import BaseRepository
from uuid import UUID
from typing import List

class MaterialRepository(BaseRepository[Material]):
    def __init__(self, db: Session):
        super().__init__(Material, db)
        
    def get_by_sku(self, sku: str) -> Material:
        return self.db.query(Material).filter(Material.sku == sku).first()

    def get_active(self) -> List[Material]:
        return self.db.query(Material).filter(Material.is_active == True).all()
