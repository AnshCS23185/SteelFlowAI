from sqlalchemy.orm import Session
from app.models.inventory_stock import InventoryStock
from app.repositories.base import BaseRepository
from uuid import UUID
from typing import List, Optional

class InventoryStockRepository(BaseRepository[InventoryStock]):
    def __init__(self, db: Session):
        super().__init__(InventoryStock, db)
        
    def get_stock(self, material_id: UUID, warehouse_id: UUID) -> Optional[InventoryStock]:
        return self.db.query(InventoryStock).filter(
            InventoryStock.material_id == material_id,
            InventoryStock.warehouse_id == warehouse_id
        ).first()
        
    def get_stock_by_material(self, material_id: UUID) -> List[InventoryStock]:
        return self.db.query(InventoryStock).filter(
            InventoryStock.material_id == material_id
        ).all()

    def get_low_stock(self) -> List[InventoryStock]:
        # Filter where current_stock - reserved_stock - issued_stock < low_stock_threshold
        # Or simple check: current_stock < low_stock_threshold
        # The prompt says: "Monitor Low Stock". Let's check against available stock or current stock.
        # Let's filter where current_stock <= low_stock_threshold
        return self.db.query(InventoryStock).filter(
            InventoryStock.current_stock <= InventoryStock.low_stock_threshold
        ).all()
