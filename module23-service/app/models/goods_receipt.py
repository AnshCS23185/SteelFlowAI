from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin
from datetime import datetime, timezone

class GoodsReceipt(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "goods_receipts"
    __table_args__ = {'extend_existing': True}
    
    grn_number = Column(String(100), unique=True, index=True, nullable=False)
    supplier = Column(String(255), nullable=True)
    invoice_number = Column(String(100), nullable=True)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=True)
    received_by = Column(String(255), nullable=True)
    received_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    warehouse = relationship("Warehouse")
    items = relationship("GoodsReceiptItem", back_populates="goods_receipt", cascade="all, delete-orphan")
