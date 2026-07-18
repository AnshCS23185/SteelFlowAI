from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class MaterialReservation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "material_reservations"
    __table_args__ = {'extend_existing': True}
    
    reservation_number = Column(String(100), unique=True, index=True, nullable=False)
    project_id = Column(UUID(as_uuid=True), nullable=True)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id"), nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=False)
    reserved_quantity = Column(Float, nullable=False)
    status = Column(String(50), default="Reserved")
    reserved_by = Column(String(255), nullable=True)
    
    material = relationship("Material")
    warehouse = relationship("Warehouse")
