from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin
from datetime import datetime, timezone

class InventoryTransaction(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "inventory_transactions"
    __table_args__ = {'extend_existing': True}
    
    transaction_type = Column(String(100), nullable=False) # Goods Receipt, Reservation, Issue, Return, Adjustment, Transfer
    reference_type = Column(String(100), nullable=True)
    reference_id = Column(UUID(as_uuid=True), nullable=True)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id"), nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    created_by = Column(String(255), nullable=True)
    description = Column(String(1000), nullable=True)
    
    material = relationship("Material")
    warehouse = relationship("Warehouse")
