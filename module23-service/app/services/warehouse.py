from sqlalchemy.orm import Session
from app.repositories.warehouse import WarehouseRepository
from app.models import Warehouse
from app.schemas.schemas import WarehouseCreate, WarehouseUpdate
from uuid import UUID
from typing import List

class WarehouseService:
    def __init__(self, db: Session):
        self.repo = WarehouseRepository(db)
        
    def get_all(self) -> List[Warehouse]:
        return self.repo.get_all()
        
    def get_by_id(self, warehouse_id: UUID) -> Warehouse:
        return self.repo.get(warehouse_id)
        
    def create(self, schema: WarehouseCreate) -> Warehouse:
        warehouse = Warehouse(
            name=schema.name,
            location=schema.location
        )
        return self.repo.create(warehouse)
        
    def update(self, warehouse_id: UUID, schema: WarehouseUpdate) -> Warehouse:
        warehouse = self.repo.get(warehouse_id)
        if not warehouse:
            return None
        if schema.name is not None:
            warehouse.name = schema.name
        if schema.location is not None:
            warehouse.location = schema.location
        self.repo.update()
        return warehouse

    def delete(self, warehouse_id: UUID) -> bool:
        warehouse = self.repo.get(warehouse_id)
        if not warehouse:
            return False
        self.repo.delete(warehouse)
        return True
