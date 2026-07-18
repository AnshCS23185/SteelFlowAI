from sqlalchemy import Column, String, Boolean
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class Material(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "materials"
    __table_args__ = {'extend_existing': True}
    
    sku = Column(String(100), unique=True, index=True, nullable=False) # Material Code
    name = Column(String(255), nullable=False) # Material Name
    category = Column(String(100), nullable=True)
    description = Column(String(1000), nullable=True)
    unit = Column(String(50), default="pcs")
    is_active = Column(Boolean, default=True)
