from sqlalchemy.orm import Session
from app.models import Inventory
from app.repositories.base import BaseRepository
from uuid import UUID
from typing import List, Optional

class InventoryStockRepository(BaseRepository[Inventory]):
    def __init__(self, db: Session):
        super().__init__(Inventory, db)
        
    def get_stock(self, material_id: UUID, warehouse_id: UUID) -> Optional[Inventory]:
        return self.db.query(Inventory).filter(
            Inventory.material_id == material_id,
            Inventory.warehouse_id == warehouse_id
        ).first()
        
    def get_stock_by_material(self, material_id: UUID) -> List[Inventory]:
        return self.db.query(Inventory).filter(
            Inventory.material_id == material_id
        ).all()

    def get_low_stock(self) -> List[Inventory]:
        # Filter where current_stock - reserved_stock - issued_stock < low_stock_threshold
        # Or simple check: current_stock < low_stock_threshold
        # The prompt says: "Monitor Low Stock". Let's check against available stock or current stock.
        # Let's filter where current_stock <= low_stock_threshold
        return self.db.query(Inventory).filter(
            Inventory.available_quantity <= Inventory.minimum_stock
        ).all()

