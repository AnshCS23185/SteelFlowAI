from sqlalchemy import Column, String
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class Warehouse(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "warehouses"
    __table_args__ = {'extend_existing': True}
    
    name = Column(String(255), unique=True, index=True, nullable=False)
    location = Column(String(255), nullable=True)
