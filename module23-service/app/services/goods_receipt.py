from sqlalchemy.orm import Session
from app.repositories.goods_receipt import GoodsReceiptRepository
from app.repositories.goods_receipt_item import GoodsReceiptItemRepository
from app.repositories.inventory_stock import InventoryStockRepository
from app.repositories.inventory_transaction import InventoryTransactionRepository
from app.models import GoodsReceipt
from app.models import GoodsReceiptItem
from app.models import Inventory
from app.models import InventoryTransaction
from app.schemas.schemas import GoodsReceiptCreate
from uuid import UUID
from typing import List
from datetime import datetime, timezone

class GoodsReceiptService:
    def __init__(self, db: Session):
        self.gr_repo = GoodsReceiptRepository(db)
        self.item_repo = GoodsReceiptItemRepository(db)
        self.stock_repo = InventoryStockRepository(db)
        self.tx_repo = InventoryTransactionRepository(db)
        
    def get_all(self) -> List[GoodsReceipt]:
        return self.gr_repo.get_all()
        
    def get_by_id(self, gr_id: UUID) -> GoodsReceipt:
        return self.gr_repo.get(gr_id)
        
    def create(self, schema: GoodsReceiptCreate) -> GoodsReceipt:
        # Create GoodsReceipt header
        gr = GoodsReceipt(
            grn_number=schema.grn_number,
            supplier=schema.supplier,
            invoice_number=schema.invoice_number,
            warehouse_id=schema.warehouse_id,
            received_by=schema.received_by,
            received_date=schema.received_date or datetime.now(timezone.utc)
        )
        self.gr_repo.create(gr)
        
        # Create items and update stock & transactions
        for item_schema in schema.items:
            gr_item = GoodsReceiptItem(
                goods_receipt_id=gr.id,
                material_id=item_schema.material_id,
                quantity=item_schema.quantity,
                rate=item_schema.rate
            )
            self.item_repo.create(gr_item)
            
            # Update Inventory Stock
            # If warehouse is set on GR header, use it. Otherwise assume a default or require it.
            wh_id = schema.warehouse_id
            if not wh_id:
                # Fallback to a default or skip
                continue
                
            stock = self.stock_repo.get_stock(item_schema.material_id, wh_id)
            if not stock:
                # Create stock record
                stock = Inventory(
                    material_id=item_schema.material_id,
                    warehouse_id=wh_id,
                    available_quantity=item_schema.quantity,
                    reserved_quantity=0.0,
                    
                    minimum_stock=10.0
                )
                self.stock_repo.create(stock)
            else:
                stock.available_quantity += item_schema.quantity
                self.stock_repo.update()
                
            # Create Inventory Transaction
            tx = InventoryTransaction(
                transaction_type="Goods Receipt",
                reference_type="Goods Receipt Item",
                reference_id=gr_item.id,
                material_id=item_schema.material_id,
                warehouse_id=wh_id,
                quantity=item_schema.quantity,
                performed_by=schema.received_by,
                remarks=f"Received goods via GRN {gr.grn_number}. Qty: {item_schema.quantity} @ Rate: {item_schema.rate}"
            )
            self.tx_repo.create(tx)
            
        return gr

