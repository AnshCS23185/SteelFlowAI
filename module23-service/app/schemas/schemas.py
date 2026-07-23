from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import List, Optional

# ==========================================
# MATERIAL SCHEMAS
# ==========================================
class MaterialBase(BaseModel):
    item_code: str = Field(..., description="Material Code / SKU")
    item_name: str = Field(..., description="Material Name")
    category: Optional[str] = None
    sub_category: Optional[str] = None
    grade: Optional[str] = None
    specification: Optional[str] = None
    dimensions: Optional[str] = None
    unit: str = "pcs"
    description: Optional[str] = None
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    qr_code: Optional[str] = None
    status: str = "Available"
    is_deleted: bool = False

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None

class MaterialResponse(MaterialBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# WAREHOUSE SCHEMAS
# ==========================================
class WarehouseBase(BaseModel):
    warehouse_code: str
    warehouse_name: str
    location: Optional[str] = None
    manager: Optional[str] = None
    capacity: Optional[float] = None
    status: str = "Active"

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseUpdate(BaseModel):
    warehouse_name: Optional[str] = None
    location: Optional[str] = None

class WarehouseResponse(WarehouseBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# INVENTORY STOCK SCHEMAS
# ==========================================
class InventoryStockBase(BaseModel):
    material_id: UUID
    warehouse_id: UUID
    available_quantity: float = 0.0
    reserved_quantity: float = 0.0
    minimum_stock: Optional[float] = None
    maximum_stock: Optional[float] = None
    reorder_level: Optional[float] = None
    storage_location: Optional[str] = None
    unit_cost: Optional[float] = None

class InventoryStockCreate(InventoryStockBase):
    pass

class InventoryStockUpdate(BaseModel):
    available_quantity: Optional[float] = None
    reserved_quantity: Optional[float] = None

class InventoryStockResponse(InventoryStockBase):
    id: UUID
    last_stock_update: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True


class InventoryDashboardResponse(BaseModel):
    totalMaterials: int
    availableStock: float
    reservedStock: float
    lowStock: int
    pendingRequests: int
    recentActivity: List[dict] = []
    inventoryTrend: List[dict] = []

# ==========================================
# MATERIAL REQUEST SCHEMAS
# ==========================================
class MaterialRequestBase(BaseModel):
    request_number: str
    project_id: Optional[UUID] = None
    material_id: UUID
    requested_by: Optional[str] = None
    approved_by: Optional[str] = None
    quantity_requested: float
    quantity_allocated: float = 0.0
    request_status: str = "Pending"
    remarks: Optional[str] = None

class MaterialRequestCreate(BaseModel):
    project_id: Optional[UUID] = None
    material_id: UUID
    quantity_requested: float
    requested_by: Optional[str] = None

class MaterialRequestUpdate(BaseModel):
    quantity_allocated: Optional[float] = None
    request_status: Optional[str] = None

class MaterialRequestResponse(MaterialRequestBase):
    id: UUID
    request_date: Optional[datetime] = None
    approval_date: Optional[datetime] = None
    issue_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None

    class Config:
        from_attributes = True


# ==========================================
# INVENTORY TRANSACTION SCHEMAS
# ==========================================
class InventoryTransactionBase(BaseModel):
    transaction_number: str
    material_id: UUID
    warehouse_id: UUID
    transaction_type: str
    quantity: float
    reference_type: Optional[str] = None
    reference_id: Optional[UUID] = None
    performed_by: Optional[str] = None
    remarks: Optional[str] = None

class InventoryTransactionCreate(InventoryTransactionBase):
    pass

class InventoryTransactionUpdate(BaseModel):
    pass

class InventoryTransactionResponse(InventoryTransactionBase):
    id: UUID
    transaction_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True

# Dummy schemas to prevent errors in unmodified API files
class GoodsReceiptItemBase(BaseModel):
    pass
class GoodsReceiptItemCreate(GoodsReceiptItemBase):
    pass
class GoodsReceiptItemUpdate(BaseModel):
    pass
class GoodsReceiptItemResponse(BaseModel):
    id: UUID
    class Config:
        from_attributes = True
class GoodsReceiptBase(BaseModel):
    pass
class GoodsReceiptCreate(BaseModel):
    items: List[GoodsReceiptItemCreate]
class GoodsReceiptUpdate(BaseModel):
    pass
class GoodsReceiptResponse(BaseModel):
    id: UUID
    class Config:
        from_attributes = True
class MaterialReservationBase(BaseModel):
    pass
class MaterialReservationCreate(BaseModel):
    pass
class MaterialReservationUpdate(BaseModel):
    pass
class MaterialReservationResponse(BaseModel):
    id: UUID
    class Config:
        from_attributes = True

