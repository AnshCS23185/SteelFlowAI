from sqlalchemy import Column, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class GoodsReceiptItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "goods_receipt_items"
    __table_args__ = {'extend_existing': True}
    
    goods_receipt_id = Column(UUID(as_uuid=True), ForeignKey("goods_receipts.id", ondelete="CASCADE"), nullable=False)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, default=0.0, nullable=False)
    
    goods_receipt = relationship("GoodsReceipt", back_populates="items")
    material = relationship("Material")
