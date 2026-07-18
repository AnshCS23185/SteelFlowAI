from sqlalchemy.orm import Session
from app.repositories.material import MaterialRepository
from app.models.material import Material
from app.schemas.schemas import MaterialCreate, MaterialUpdate
from uuid import UUID
from typing import List

class MaterialService:
    def __init__(self, db: Session):
        self.repo = MaterialRepository(db)
        
    def get_all(self) -> List[Material]:
        return self.repo.get_all()
        
    def get_by_id(self, material_id: UUID) -> Material:
        return self.repo.get(material_id)
        
    def get_by_sku(self, sku: str) -> Material:
        return self.repo.get_by_sku(sku)
        
    def create(self, schema: MaterialCreate) -> Material:
        material = Material(
            sku=schema.sku,
            name=schema.name,
            category=schema.category,
            description=schema.description,
            unit=schema.unit,
            is_active=schema.is_active
        )
        return self.repo.create(material)
        
    def update(self, material_id: UUID, schema: MaterialUpdate) -> Material:
        material = self.repo.get(material_id)
        if not material:
            return None
        if schema.sku is not None:
            material.sku = schema.sku
        if schema.name is not None:
            material.name = schema.name
        if schema.category is not None:
            material.category = schema.category
        if schema.description is not None:
            material.description = schema.description
        if schema.unit is not None:
            material.unit = schema.unit
        if schema.is_active is not None:
            material.is_active = schema.is_active
        self.repo.update()
        return material

    def delete(self, material_id: UUID) -> bool:
        material = self.repo.get(material_id)
        if not material:
            return False
        self.repo.delete(material)
        return True
