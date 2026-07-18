from sqlalchemy.orm import Session
from app.repositories.reservation import ReservationRepository
from app.repositories.inventory_stock import InventoryStockRepository
from app.repositories.inventory_transaction import InventoryTransactionRepository
from app.repositories.material_request import MaterialRequestRepository
from app.models.reservation import MaterialReservation
from app.models.inventory_stock import InventoryStock
from app.models.inventory_transaction import InventoryTransaction
from app.models.material_request import MaterialRequest
from app.schemas.schemas import MaterialReservationCreate
from uuid import UUID
from typing import List, Optional
import uuid

class ReservationService:
    def __init__(self, db: Session):
        self.res_repo = ReservationRepository(db)
        self.stock_repo = InventoryStockRepository(db)
        self.tx_repo = InventoryTransactionRepository(db)
        self.req_repo = MaterialRequestRepository(db)
        
    def get_all(self) -> List[MaterialReservation]:
        return self.res_repo.get_all()
        
    def get_by_id(self, res_id: UUID) -> MaterialReservation:
        return self.res_repo.get(res_id)
        
    def get_by_project(self, project_id: UUID) -> List[MaterialReservation]:
        return self.res_repo.get_by_project(project_id)
        
    def reserve_material(self, schema: MaterialReservationCreate) -> dict:
        # Check stock record
        stock = self.stock_repo.get_stock(schema.material_id, schema.warehouse_id)
        
        # Calculate available quantity
        current = stock.current_stock if stock else 0.0
        reserved = stock.reserved_stock if stock else 0.0
        issued = stock.issued_stock if stock else 0.0
        available = current - reserved - issued
        
        needed_qty = schema.reserved_quantity
        
        if stock and available >= needed_qty:
            # Enough Stock
            stock.reserved_stock += needed_qty
            self.stock_repo.update()
            
            res_number = f"RES-{uuid.uuid4().hex[:8].upper()}"
            res = MaterialReservation(
                reservation_number=res_number,
                project_id=schema.project_id,
                material_id=schema.material_id,
                warehouse_id=schema.warehouse_id,
                reserved_quantity=needed_qty,
                status="Reserved",
                reserved_by=schema.reserved_by
            )
            self.res_repo.create(res)
            
            # Create transaction
            tx = InventoryTransaction(
                transaction_type="Reservation",
                reference_type="Material Reservation",
                reference_id=res.id,
                material_id=schema.material_id,
                warehouse_id=schema.warehouse_id,
                quantity=needed_qty,
                created_by=schema.reserved_by,
                description=f"Reserved {needed_qty} units for project {schema.project_id or 'N/A'}"
            )
            self.tx_repo.create(tx)
            
            return {
                "success": True,
                "reservation": res,
                "request": None,
                "shortage": 0.0
            }
        else:
            # Insufficient Stock
            shortage = needed_qty - (available if available > 0 else 0.0)
            req_number = f"REQ-{uuid.uuid4().hex[:8].upper()}"
            
            # Automatically create a material request
            req = MaterialRequest(
                request_number=req_number,
                project_id=schema.project_id,
                material_id=schema.material_id,
                warehouse_id=schema.warehouse_id,
                required_quantity=needed_qty,
                shortage_quantity=shortage,
                approved_quantity=0.0,
                status="Pending",
                created_by=schema.reserved_by
            )
            self.req_repo.create(req)
            
            # If there was partial stock available, we can optionally reserve the available stock
            partial_reserved = 0.0
            res = None
            if stock and available > 0:
                partial_reserved = available
                stock.reserved_stock += partial_reserved
                self.stock_repo.update()
                
                res_number = f"RES-{uuid.uuid4().hex[:8].upper()}"
                res = MaterialReservation(
                    reservation_number=res_number,
                    project_id=schema.project_id,
                    material_id=schema.material_id,
                    warehouse_id=schema.warehouse_id,
                    reserved_quantity=partial_reserved,
                    status="Reserved",
                    reserved_by=schema.reserved_by
                )
                self.res_repo.create(res)
                
                # Create transaction for partial reservation
                tx = InventoryTransaction(
                    transaction_type="Reservation",
                    reference_type="Material Reservation",
                    reference_id=res.id,
                    material_id=schema.material_id,
                    warehouse_id=schema.warehouse_id,
                    quantity=partial_reserved,
                    created_by=schema.reserved_by,
                    description=f"Partially reserved {partial_reserved} units (Shortage: {shortage}) for project {schema.project_id or 'N/A'}"
                )
                self.tx_repo.create(tx)
                
            return {
                "success": False,
                "reservation": res,
                "request": req,
                "shortage": shortage
            }

    def release_reservation(self, res_id: UUID) -> bool:
        res = self.res_repo.get(res_id)
        if not res or res.status != "Reserved":
            return False
            
        stock = self.stock_repo.get_stock(res.material_id, res.warehouse_id)
        if stock:
            # Decrease reserved stock
            stock.reserved_stock = max(0.0, stock.reserved_stock - res.reserved_quantity)
            self.stock_repo.update()
            
        res.status = "Released"
        self.res_repo.update()
        
        # Create transaction for release
        tx = InventoryTransaction(
            transaction_type="Adjustment",
            reference_type="Material Reservation",
            reference_id=res.id,
            material_id=res.material_id,
            warehouse_id=res.warehouse_id,
            quantity=-res.reserved_quantity,
            created_by=res.reserved_by,
            description=f"Released reservation {res.reservation_number}. Qty: {res.reserved_quantity}"
        )
        self.tx_repo.create(tx)
        
        return True
