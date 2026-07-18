from sqlalchemy.orm import Session
from app.models.inventory_transaction import InventoryTransaction
from app.repositories.base import BaseRepository
from uuid import UUID
from typing import List

class InventoryTransactionRepository(BaseRepository[InventoryTransaction]):
    def __init__(self, db: Session):
        super().__init__(InventoryTransaction, db)
        
    def get_by_material(self, material_id: UUID) -> List[InventoryTransaction]:
        return self.db.query(InventoryTransaction).filter(
            InventoryTransaction.material_id == material_id
        ).order_by(InventoryTransaction.created_at.desc()).all()

    def get_recent(self, limit: int = 50) -> List[InventoryTransaction]:
        return self.db.query(InventoryTransaction).order_by(
            InventoryTransaction.created_at.desc()
        ).limit(limit).all()
