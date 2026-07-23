import enum
from sqlalchemy import Column, String, Float, Boolean, ForeignKey, Text, Enum as SQLEnum, UniqueConstraint, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin
import uuid

# ==========================================
# ENUMS
# ==========================================
class MaterialStatus(str, enum.Enum):
    AVAILABLE = "Available"
    LOW_STOCK = "Low Stock"
    OUT_OF_STOCK = "Out of Stock"
    INACTIVE = "Inactive"

class RequestStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    ALLOCATED = "Allocated"
    ISSUED = "Issued"
    COMPLETED = "Completed"

class AllocationStatus(str, enum.Enum):
    PENDING = "Pending"
    ALLOCATED = "Allocated"
    RELEASED = "Released"

class TransactionType(str, enum.Enum):
    IN = "IN"
    OUT = "OUT"
    TRANSFER = "TRANSFER"
    RETURN = "RETURN"
    ALLOCATION = "ALLOCATION"
    RELEASE = "RELEASE"
    ADJUSTMENT = "ADJUSTMENT"

class WarehouseStatus(str, enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"


# ==========================================
# MODELS
# ==========================================

class Material(Base, UUIDMixin, TimestampMixin):
    """
    1. Materials (Material Master)
    Master table for all inventory items. Does NOT store stock quantity.
    """
    __tablename__ = "materials"
    __table_args__ = {'extend_existing': True}
    
    item_code = Column(String(100), unique=True, index=True, nullable=False)
    item_name = Column(String(255), index=True, nullable=False)
    category = Column(String(100), index=True, nullable=True)
    sub_category = Column(String(100), nullable=True)
    grade = Column(String(100), nullable=True)
    specification = Column(String(255), nullable=True)
    dimensions = Column(String(100), nullable=True)
    unit = Column(String(50), nullable=False, default="pcs")
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    barcode = Column(String(255), nullable=True)
    qr_code = Column(String(255), nullable=True)
    status = Column(SQLEnum(MaterialStatus), nullable=False, default=MaterialStatus.AVAILABLE)
    is_deleted = Column(Boolean, nullable=False, default=False)
    
    # Relationships
    inventory_items = relationship("Inventory", back_populates="material", cascade="all, delete-orphan")
    requests = relationship("MaterialRequest", back_populates="material")
    allocation_logs = relationship("MaterialAllocationLog", back_populates="material")
    transactions = relationship("InventoryTransaction", back_populates="material")


class Warehouse(Base, UUIDMixin, TimestampMixin):
    """
    6. Warehouses
    Keeps track of physical locations and capacities.
    """
    __tablename__ = "warehouses"
    __table_args__ = {'extend_existing': True}
    
    warehouse_code = Column(String(100), unique=True, nullable=False)
    warehouse_name = Column(String(255), nullable=False)
    location = Column(String(500), nullable=True)
    manager = Column(String(255), nullable=True)
    capacity = Column(Float, nullable=True)
    status = Column(SQLEnum(WarehouseStatus), nullable=False, default=WarehouseStatus.ACTIVE)
    
    # Relationships
    inventory_items = relationship("Inventory", back_populates="warehouse", cascade="all, delete-orphan")
    allocation_logs = relationship("MaterialAllocationLog", back_populates="warehouse")
    transactions = relationship("InventoryTransaction", back_populates="warehouse")


class Inventory(Base, UUIDMixin, TimestampMixin):
    """
    2. Inventory
    Tracks stock levels per material per warehouse. Value is calculated on the fly.
    """
    __tablename__ = "inventory"
    __table_args__ = (
        UniqueConstraint('material_id', 'warehouse_id', name='uq_inventory_material_warehouse'),
        {'extend_existing': True}
    )
    
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="RESTRICT", onupdate="CASCADE"), index=True, nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="RESTRICT", onupdate="CASCADE"), index=True, nullable=False)
    
    available_quantity = Column(Float, nullable=False, default=0.0)
    reserved_quantity = Column(Float, nullable=False, default=0.0)
    
    minimum_stock = Column(Float, nullable=True)
    maximum_stock = Column(Float, nullable=True)
    reorder_level = Column(Float, nullable=True)
    
    storage_location = Column(String(255), nullable=True) # specific bin/rack
    unit_cost = Column(Float, nullable=True)
    last_stock_update = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    material = relationship("Material", back_populates="inventory_items")
    warehouse = relationship("Warehouse", back_populates="inventory_items")


class MaterialRequest(Base, UUIDMixin, TimestampMixin):
    """
    3. Material Requests
    Workflow table tracking project requisitions.
    """
    __tablename__ = "material_requests"
    __table_args__ = {'extend_existing': True}
    
    request_number = Column(String(100), unique=True, nullable=False)
    project_id = Column(UUID(as_uuid=True), nullable=True) # Loose FK to Module 1 Projects
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="RESTRICT", onupdate="CASCADE"), index=True, nullable=False)
    
    requested_by = Column(String(255), nullable=True)
    approved_by = Column(String(255), nullable=True)
    
    quantity_requested = Column(Float, nullable=False)
    quantity_allocated = Column(Float, nullable=False, default=0.0)
    
    request_status = Column(SQLEnum(RequestStatus), index=True, nullable=False, default=RequestStatus.PENDING)
    remarks = Column(Text, nullable=True)
    
    request_date = Column(DateTime(timezone=True), nullable=True)
    approval_date = Column(DateTime(timezone=True), nullable=True)
    issue_date = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    material = relationship("Material", back_populates="requests")
    allocation_logs = relationship("MaterialAllocationLog", back_populates="request")


class MaterialAllocationLog(Base, UUIDMixin, TimestampMixin):
    """
    4. Material Allocation Logs
    Immutable audit trail for allocations linking a request to a warehouse physical stock.
    """
    __tablename__ = "material_allocation_logs"
    __table_args__ = {'extend_existing': True}
    
    allocation_number = Column(String(100), unique=True, nullable=False)
    request_id = Column(UUID(as_uuid=True), ForeignKey("material_requests.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="RESTRICT", onupdate="CASCADE"), index=True, nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="RESTRICT", onupdate="CASCADE"), index=True, nullable=False)
    
    allocated_quantity = Column(Float, nullable=False)
    allocated_by = Column(String(255), nullable=True)
    allocation_status = Column(SQLEnum(AllocationStatus), nullable=False, default=AllocationStatus.PENDING)
    remarks = Column(Text, nullable=True)
    allocated_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    request = relationship("MaterialRequest", back_populates="allocation_logs")
    material = relationship("Material", back_populates="allocation_logs")
    warehouse = relationship("Warehouse", back_populates="allocation_logs")


class InventoryTransaction(Base, UUIDMixin, TimestampMixin):
    """
    5. Inventory Transactions
    Immutable ledger of all stock movements.
    """
    __tablename__ = "inventory_transactions"
    __table_args__ = {'extend_existing': True}
    
    transaction_number = Column(String(100), unique=True, nullable=False)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="RESTRICT", onupdate="CASCADE"), index=True, nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="RESTRICT", onupdate="CASCADE"), index=True, nullable=False)
    
    transaction_type = Column(SQLEnum(TransactionType), index=True, nullable=False)
    quantity = Column(Float, nullable=False) # Can be positive or negative or always positive based on type
    
    reference_type = Column(String(100), nullable=True)
    reference_id = Column(UUID(as_uuid=True), nullable=True)
    performed_by = Column(String(255), nullable=True)
    remarks = Column(Text, nullable=True)
    transaction_date = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    material = relationship("Material", back_populates="transactions")
    warehouse = relationship("Warehouse", back_populates="transactions")


class GoodsReceipt(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "goods_receipts"
    __table_args__ = {'extend_existing': True}
    
    grn_number = Column(String(100), unique=True, nullable=False)
    supplier = Column(String(255), nullable=True)
    invoice_number = Column(String(100), nullable=True)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=True)
    received_by = Column(String(255), nullable=True)
    received_date = Column(DateTime(timezone=True), nullable=True)
    
    items = relationship("GoodsReceiptItem", back_populates="goods_receipt", cascade="all, delete-orphan")
    warehouse = relationship("Warehouse")

class GoodsReceiptItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "goods_receipt_items"
    __table_args__ = {'extend_existing': True}
    
    goods_receipt_id = Column(UUID(as_uuid=True), ForeignKey("goods_receipts.id", ondelete="CASCADE"), nullable=False)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, default=0.0)
    
    goods_receipt = relationship("GoodsReceipt", back_populates="items")
    material = relationship("Material")

class MaterialReservation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "material_reservations"
    __table_args__ = {'extend_existing': True}
    
    reservation_number = Column(String(100), unique=True, nullable=False)
    project_id = Column(UUID(as_uuid=True), nullable=True)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    reserved_quantity = Column(Float, nullable=False)
    status = Column(String(50), default="Reserved")
    reserved_by = Column(String(255), nullable=True)
    
    material = relationship("Material")
    warehouse = relationship("Warehouse")

