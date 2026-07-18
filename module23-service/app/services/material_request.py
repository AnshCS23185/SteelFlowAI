from sqlalchemy.orm import Session
from app.repositories.material_request import MaterialRequestRepository
from app.repositories.inventory_stock import InventoryStockRepository
from app.repositories.inventory_transaction import InventoryTransactionRepository
from app.models.material_request import MaterialRequest
from app.models.inventory_stock import InventoryStock
from app.models.inventory_transaction import InventoryTransaction
from app.schemas.schemas import MaterialRequestCreate, MaterialRequestUpdate
from uuid import UUID
from typing import List, Optional
import uuid

class MaterialRequestService:
    def __init__(self, db: Session):
        self.req_repo = MaterialRequestRepository(db)
        self.stock_repo = InventoryStockRepository(db)
        self.tx_repo = InventoryTransactionRepository(db)
        
    def get_all(self) -> List[MaterialRequest]:
        return self.req_repo.get_all()
        
    def get_by_id(self, req_id: UUID) -> MaterialRequest:
        return self.req_repo.get(req_id)
        
    def get_by_project(self, project_id: UUID) -> List[MaterialRequest]:
        return self.req_repo.get_by_project(project_id)
        
    def raise_request(self, schema: MaterialRequestCreate) -> MaterialRequest:
        # Calculate shortage dynamically if there's stock
        stock = self.stock_repo.get_stock(schema.material_id, schema.warehouse_id)
        available = 0.0
        if stock:
            available = stock.current_stock - stock.reserved_stock - stock.issued_stock
            
        shortage = schema.required_quantity - (available if available > 0 else 0.0)
        if shortage < 0:
            shortage = 0.0
            
        req_number = f"REQ-{uuid.uuid4().hex[:8].upper()}"
        req = MaterialRequest(
            request_number=req_number,
            project_id=schema.project_id,
            material_id=schema.material_id,
            warehouse_id=schema.warehouse_id,
            required_quantity=schema.required_quantity,
            shortage_quantity=shortage,
            approved_quantity=0.0,
            status="Pending",
            created_by=schema.created_by
        )
        return self.req_repo.create(req)
        
    def approve_request(self, req_id: UUID, approved_qty: Optional[float] = None, reviewed_by: Optional[str] = None) -> Optional[MaterialRequest]:
        req = self.req_repo.get(req_id)
        if not req or req.status != "Pending":
            return None
            
        if approved_qty is None:
            approved_qty = req.required_quantity
            
        req.approved_quantity = approved_qty
        req.reviewed_by = reviewed_by
        
        if approved_qty >= req.required_quantity:
            req.status = "Completed"
        else:
            req.status = "Completed" # Or "Partially Approved" -> "Completed". Let's set it to Completed as the workflow ends.
            
        # Update stock: Since request is approved, we receive the material into the warehouse
        stock = self.stock_repo.get_stock(req.material_id, req.warehouse_id)
        if not stock:
            stock = InventoryStock(
                material_id=req.material_id,
                warehouse_id=req.warehouse_id,
                current_stock=approved_qty,
                reserved_stock=0.0,
                issued_stock=0.0,
                low_stock_threshold=10.0
            )
            self.stock_repo.create(stock)
        else:
            stock.current_stock += approved_qty
            self.stock_repo.update()
            
        # Create Inventory Transaction
        tx = InventoryTransaction(
            transaction_type="Goods Receipt",
            reference_type="Material Request",
            reference_id=req.id,
            material_id=req.material_id,
            warehouse_id=req.warehouse_id,
            quantity=approved_qty,
            created_by=reviewed_by,
            description=f"Approved Material Request {req.request_number}. Stock increased by {approved_qty}."
        )
        self.tx_repo.create(tx)
        
        self.req_repo.update()
        return req

    def reject_request(self, req_id: UUID, reviewed_by: Optional[str] = None) -> Optional[MaterialRequest]:
        req = self.req_repo.get(req_id)
        if not req or req.status != "Pending":
            return None
            
        req.status = "Rejected"
        req.reviewed_by = reviewed_by
        self.req_repo.update()
        return req
