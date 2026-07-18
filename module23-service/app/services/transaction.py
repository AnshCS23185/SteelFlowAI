from sqlalchemy.orm import Session
from app.repositories.inventory_transaction import InventoryTransactionRepository
from app.models.inventory_transaction import InventoryTransaction
from uuid import UUID
from typing import List

class TransactionService:
    def __init__(self, db: Session):
        self.repo = InventoryTransactionRepository(db)
        
    def get_all(self, limit: int = 50) -> List[InventoryTransaction]:
        return self.repo.get_recent(limit)
        
    def get_by_material(self, material_id: UUID) -> List[InventoryTransaction]:
        return self.repo.get_by_material(material_id)
