from sqlalchemy import Column, Float, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class InventoryStock(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "inventory_stock"
    __table_args__ = (
        UniqueConstraint('material_id', 'warehouse_id', name='_material_warehouse_uc'),
        {'extend_existing': True}
    )
    
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="CASCADE"), nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=False)
    current_stock = Column(Float, default=0.0, nullable=False)
    reserved_stock = Column(Float, default=0.0, nullable=False)
    issued_stock = Column(Float, default=0.0, nullable=False)
    low_stock_threshold = Column(Float, default=10.0, nullable=False)
    
    material = relationship("Material")
    warehouse = relationship("Warehouse")
    
    @property
    def available_stock(self) -> float:
        return self.current_stock - self.reserved_stock - self.issued_stock
