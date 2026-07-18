from sqlalchemy.orm import Session
from app.repositories.inventory_stock import InventoryStockRepository
from app.repositories.inventory_transaction import InventoryTransactionRepository
from app.models.inventory_stock import InventoryStock
from app.models.inventory_transaction import InventoryTransaction
from app.schemas.schemas import InventoryStockCreate, InventoryStockUpdate
from uuid import UUID
from typing import List, Optional

class InventoryService:
    def __init__(self, db: Session):
        self.stock_repo = InventoryStockRepository(db)
        self.tx_repo = InventoryTransactionRepository(db)
        
    def get_all_stock(self) -> List[InventoryStock]:
        return self.stock_repo.get_all()
        
    def get_stock_by_material(self, material_id: UUID) -> List[InventoryStock]:
        return self.stock_repo.get_stock_by_material(material_id)
        
    def get_stock_by_material_and_warehouse(self, material_id: UUID, warehouse_id: UUID) -> Optional[InventoryStock]:
        return self.stock_repo.get_stock(material_id, warehouse_id)

    def get_low_stock(self) -> List[InventoryStock]:
        return self.stock_repo.get_low_stock()
        
    def update_stock(self, material_id: UUID, warehouse_id: UUID, current_stock: float, updated_by: Optional[str] = "System") -> InventoryStock:
        stock = self.stock_repo.get_stock(material_id, warehouse_id)
        if not stock:
            # Create a new stock record if it doesn't exist
            stock = InventoryStock(
                material_id=material_id,
                warehouse_id=warehouse_id,
                current_stock=current_stock,
                reserved_stock=0.0,
                issued_stock=0.0,
                low_stock_threshold=10.0
            )
            self.stock_repo.create(stock)
            
            # Create transaction
            tx = InventoryTransaction(
                transaction_type="Adjustment",
                material_id=material_id,
                warehouse_id=warehouse_id,
                quantity=current_stock,
                created_by=updated_by,
                description=f"Initial stock adjustment set to {current_stock}"
            )
            self.tx_repo.create(tx)
        else:
            diff = current_stock - stock.current_stock
            stock.current_stock = current_stock
            self.stock_repo.update()
            
            # Create transaction for difference
            tx = InventoryTransaction(
                transaction_type="Adjustment",
                material_id=material_id,
                warehouse_id=warehouse_id,
                quantity=diff,
                created_by=updated_by,
                description=f"Stock adjustment. Current stock updated to {current_stock} (Diff: {diff:+})"
            )
            self.tx_repo.create(tx)
            
        return stock
