from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class Supplier(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "suppliers"
    
    name = Column(String(255), index=True, nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    
    materials = relationship("Material", back_populates="supplier")

class Material(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "materials"
    
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=True)
    
    supplier = relationship("Supplier", back_populates="materials")
    inventory = relationship("Inventory", back_populates="material", uselist=False)

class Inventory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "inventory"
    
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id"), unique=True, nullable=False)
    quantity = Column(Float, default=0.0)
    warehouse_location = Column(String(100), nullable=True)
    
    material = relationship("Material", back_populates="inventory")

class ProductionJob(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "production_jobs"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    status = Column(String(50), default="pending")
    supervisor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # We reference Project and User without back_populates for simplicity, 
    # but could add them to module1 if needed.
    project = relationship("steelflow_db.models.module1.Project")
    supervisor = relationship("steelflow_db.models.module1.User")
