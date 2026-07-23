from sqlalchemy.orm import Session
from app.repositories.inventory_stock import InventoryStockRepository
from app.repositories.inventory_transaction import InventoryTransactionRepository
from app.models import Inventory
from app.models import InventoryTransaction
from app.schemas.schemas import InventoryStockCreate, InventoryStockUpdate
from uuid import UUID
from typing import List, Optional

class InventoryService:
    def __init__(self, db: Session):
        self.db = db
        self.stock_repo = InventoryStockRepository(db)
        self.tx_repo = InventoryTransactionRepository(db)
        
    def get_all_stock(self) -> List[Inventory]:
        return self.stock_repo.get_all()
        
    def get_stock_by_material(self, material_id: UUID) -> List[Inventory]:
        return self.stock_repo.get_stock_by_material(material_id)
        
    def get_stock_by_material_and_warehouse(self, material_id: UUID, warehouse_id: UUID) -> Optional[Inventory]:
        return self.stock_repo.get_stock(material_id, warehouse_id)

    def get_low_stock(self) -> List[Inventory]:
        return self.stock_repo.get_low_stock()
        
    def update_stock(self, material_id: UUID, warehouse_id: UUID, current_stock: float, updated_by: Optional[str] = "System") -> Inventory:
        stock = self.stock_repo.get_stock(material_id, warehouse_id)
        if not stock:
            # Create a new stock record if it doesn't exist
            stock = Inventory(
                material_id=material_id,
                warehouse_id=warehouse_id,
                available_quantity=current_stock,
                reserved_quantity=0.0,
                minimum_stock=10.0
            )
            self.stock_repo.create(stock)
            
            # Create transaction
            tx = InventoryTransaction(
                transaction_type="Adjustment",
                material_id=material_id,
                warehouse_id=warehouse_id,
                quantity=current_stock,
                performed_by=updated_by,
                remarks=f"Initial stock adjustment set to {current_stock}"
            )
            self.tx_repo.create(tx)
        else:
            diff = current_stock - stock.available_quantity
            stock.available_quantity = current_stock
            self.stock_repo.update()
            
            # Create transaction for difference
            tx = InventoryTransaction(
                transaction_type="Adjustment",
                material_id=material_id,
                warehouse_id=warehouse_id,
                quantity=diff,
                performed_by=updated_by,
                remarks=f"Stock adjustment. Current stock updated to {current_stock} (Diff: {diff:+})"
            )
            self.tx_repo.create(tx)
            
        return stock

    def get_dashboard_summary(self) -> dict:
        from sqlalchemy import func
        from app.models import Material
        from app.models import MaterialRequest
        from app.models import InventoryTransaction
        
        # Total Materials
        total_materials = self.db.query(func.count(Material.id)).scalar() or 0
        
        # Stock Aggregations
        stock_agg = self.db.query(
            func.sum(self.stock_repo.model.available_quantity).label('total_current'),
            func.sum(self.stock_repo.model.reserved_quantity).label('total_reserved')
        ).first()
        
        total_current = stock_agg.total_current or 0.0
        total_reserved = stock_agg.total_reserved or 0.0
        available_stock = total_current - total_reserved
        
        # Low stock
        low_stock_count = self.db.query(func.count(self.stock_repo.model.id)).filter(
            (self.stock_repo.model.available_quantity - self.stock_repo.model.reserved_quantity) <= self.stock_repo.model.minimum_stock
        ).scalar() or 0
        
        # Pending Requests
        pending_requests = self.db.query(func.count(MaterialRequest.id)).filter(
            MaterialRequest.request_status == "Pending"
        ).scalar() or 0
        
        # Recent Activity (Transactions)
        recent_txs = self.db.query(InventoryTransaction).order_by(
            InventoryTransaction.created_at.desc()
        ).limit(5).all()
        
        recent_activity = []
        for tx in recent_txs:
            recent_activity.append({
                "id": str(tx.id),
                "type": tx.transaction_type,
                "quantity": tx.quantity,
                "date": tx.created_at.isoformat() if tx.created_at else None,
                "description": tx.remarks
            })
            
        return {
            "totalMaterials": total_materials,
            "availableStock": available_stock,
            "reservedStock": total_reserved,
            "lowStock": low_stock_count,
            "pendingRequests": pending_requests,
            "recentActivity": recent_activity,
            "inventoryTrend": [] # Can be implemented later if trend data points are needed
        }

