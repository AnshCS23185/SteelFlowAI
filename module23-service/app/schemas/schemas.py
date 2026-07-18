from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import List, Optional

# ==========================================
# MATERIAL SCHEMAS
# ==========================================
class MaterialBase(BaseModel):
    sku: str = Field(..., description="Material Code / SKU")
    name: str = Field(..., description="Material Name")
    category: Optional[str] = None
    description: Optional[str] = None
    unit: str = "pcs"
    is_active: bool = True

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None
    is_active: Optional[bool] = None

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
    name: str
    location: Optional[str] = None

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
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
    current_stock: float = 0.0
    reserved_stock: float = 0.0
    issued_stock: float = 0.0
    low_stock_threshold: float = 10.0

class InventoryStockCreate(InventoryStockBase):
    pass

class InventoryStockUpdate(BaseModel):
    current_stock: Optional[float] = None
    reserved_stock: Optional[float] = None
    issued_stock: Optional[float] = None
    low_stock_threshold: Optional[float] = None

class InventoryStockResponse(InventoryStockBase):
    id: UUID
    available_stock: float
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True


# ==========================================
# GOODS RECEIPT SCHEMAS
# ==========================================
class GoodsReceiptItemBase(BaseModel):
    material_id: UUID
    quantity: float
    rate: float = 0.0

class GoodsReceiptItemCreate(GoodsReceiptItemBase):
    pass

class GoodsReceiptItemUpdate(BaseModel):
    material_id: Optional[UUID] = None
    quantity: Optional[float] = None
    rate: Optional[float] = None

class GoodsReceiptItemResponse(GoodsReceiptItemBase):
    id: UUID
    goods_receipt_id: UUID
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None

    class Config:
        from_attributes = True


class GoodsReceiptBase(BaseModel):
    grn_number: str
    supplier: Optional[str] = None
    invoice_number: Optional[str] = None
    warehouse_id: Optional[UUID] = None
    received_by: Optional[str] = None
    received_date: Optional[datetime] = None

class GoodsReceiptCreate(GoodsReceiptBase):
    items: List[GoodsReceiptItemCreate]

class GoodsReceiptUpdate(BaseModel):
    supplier: Optional[str] = None
    invoice_number: Optional[str] = None
    warehouse_id: Optional[UUID] = None
    received_by: Optional[str] = None
    received_date: Optional[datetime] = None

class GoodsReceiptResponse(GoodsReceiptBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    items: List[GoodsReceiptItemResponse] = []
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True


# ==========================================
# MATERIAL RESERVATION SCHEMAS
# ==========================================
class MaterialReservationBase(BaseModel):
    reservation_number: str
    project_id: Optional[UUID] = None
    material_id: UUID
    warehouse_id: UUID
    reserved_quantity: float
    status: str = "Reserved"
    reserved_by: Optional[str] = None

class MaterialReservationCreate(BaseModel):
    project_id: Optional[UUID] = None
    material_id: UUID
    warehouse_id: UUID
    reserved_quantity: float
    reserved_by: Optional[str] = None

class MaterialReservationUpdate(BaseModel):
    reserved_quantity: Optional[float] = None
    status: Optional[str] = None

class MaterialReservationResponse(MaterialReservationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True


# ==========================================
# MATERIAL REQUEST SCHEMAS
# ==========================================
class MaterialRequestBase(BaseModel):
    request_number: str
    project_id: Optional[UUID] = None
    material_id: UUID
    warehouse_id: UUID
    required_quantity: float
    shortage_quantity: float = 0.0
    approved_quantity: float = 0.0
    status: str = "Pending"
    created_by: Optional[str] = None
    reviewed_by: Optional[str] = None

class MaterialRequestCreate(BaseModel):
    project_id: Optional[UUID] = None
    material_id: UUID
    warehouse_id: UUID
    required_quantity: float
    created_by: Optional[str] = None

class MaterialRequestUpdate(BaseModel):
    approved_quantity: Optional[float] = None
    status: Optional[str] = None
    reviewed_by: Optional[str] = None

class MaterialRequestResponse(MaterialRequestBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True


# ==========================================
# INVENTORY TRANSACTION SCHEMAS
# ==========================================
class InventoryTransactionBase(BaseModel):
    transaction_type: str
    reference_type: Optional[str] = None
    reference_id: Optional[UUID] = None
    material_id: UUID
    warehouse_id: UUID
    quantity: float
    created_by: Optional[str] = None
    description: Optional[str] = None

class InventoryTransactionCreate(InventoryTransactionBase):
    pass

class InventoryTransactionUpdate(BaseModel):
    pass

class InventoryTransactionResponse(InventoryTransactionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    material: Optional[MaterialResponse] = None
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True
