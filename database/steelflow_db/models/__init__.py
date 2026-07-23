# Models initialization
from steelflow_db.core.base import Base

# Import all models here so Alembic can find them easily
from .module1 import User, Client, Project, Document
from .module23 import (
    Material, Warehouse, Inventory, MaterialRequest, 
    MaterialAllocationLog, InventoryTransaction,
    GoodsReceipt, GoodsReceiptItem, MaterialReservation
)
from .module45 import Schedule, ProjectHealth, Trailer, Dispatch

__all__ = [
    "User",
    "Project",
    "Material",
    "Warehouse",
    "Inventory",
    "MaterialRequest",
    "MaterialAllocationLog",
    "InventoryTransaction",
    "GoodsReceipt",
    "GoodsReceiptItem",
    "MaterialReservation"
]
