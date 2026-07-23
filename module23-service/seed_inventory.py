import sys
import os
import uuid
from datetime import datetime, timezone
import random

# Setup paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'database')))
sys.path.append(os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from steelflow_db.core.db import SessionLocal, engine
from steelflow_db.models.module23 import (
    Material, Warehouse, Inventory, MaterialRequest, 
    MaterialAllocationLog, InventoryTransaction,
    MaterialStatus, WarehouseStatus, TransactionType
)

def generate_sku(category, index):
    prefix = "".join([word[0] for word in category.split()]).upper()
    return f"{prefix}-{1000 + index}"

def seed():
    db = SessionLocal()
    
    print("Starting database seed...")
    
    # Check if we already seeded
    if db.query(Warehouse).count() > 0:
        print("Database already contains data. Skipping seed.")
        return

    # Create Warehouses
    warehouses = [
        Warehouse(
            id=uuid.uuid4(),
            warehouse_code="WH-MAIN-01",
            warehouse_name="Main Factory Storage",
            location="Zone A, Sector 1",
            manager="John Smith",
            capacity=10000.0,
            status=WarehouseStatus.ACTIVE
        ),
        Warehouse(
            id=uuid.uuid4(),
            warehouse_code="WH-SUB-02",
            warehouse_name="Secondary Overflow",
            location="Zone B, Sector 3",
            manager="Sarah Connor",
            capacity=5000.0,
            status=WarehouseStatus.ACTIVE
        )
    ]
    db.add_all(warehouses)
    db.commit()
    
    # Create Materials
    materials_data = [
        ("Mild Steel Beams", "Structural Steel", "I-Beam", "ASTM A36", "200x100mm", "pcs"),
        ("Galvanized Sheets", "Sheet Metal", "Galvanized", "ASTM A653", "2mm thick", "sheets"),
        ("High-Tensile Rebar", "Reinforcement", "TMT Bar", "Fe500D", "12mm diameter", "pcs"),
        ("Stainless Steel Pipes", "Piping", "SS304", "Schedule 40", "2 inch", "meters"),
        ("Mild Steel Plates", "Sheet Metal", "Hot Rolled", "IS 2062", "10mm thick", "pcs"),
        ("Aluminum Angles", "Structural", "6061-T6", "L-Profile", "50x50x5mm", "pcs"),
        ("Carbon Steel Channels", "Structural Steel", "C-Channel", "ASTM A36", "150x75mm", "pcs"),
        ("Copper Coils", "Electrical", "Pure Copper", "Grade A", "1mm diameter", "kg"),
        ("Welding Rods", "Consumables", "E7018", "AWS A5.1", "3.2mm", "boxes"),
        ("Grinding Discs", "Consumables", "Abrasive", "Type 27", "125mm", "pcs"),
    ]
    
    created_materials = []
    for i, data in enumerate(materials_data):
        name, category, sub, grade, dims, unit = data
        mat = Material(
            id=uuid.uuid4(),
            item_code=generate_sku(category, i),
            item_name=name,
            category=category,
            sub_category=sub,
            grade=grade,
            specification=f"{name} - {grade}",
            dimensions=dims,
            unit=unit,
            status=MaterialStatus.AVAILABLE
        )
        created_materials.append(mat)
    
    db.add_all(created_materials)
    db.commit()
    
    # Create Inventory and Transactions
    for mat in created_materials:
        # Put stock in both warehouses randomly
        for wh in warehouses:
            stock_qty = random.uniform(50.0, 500.0)
            
            # Inventory
            inv = Inventory(
                id=uuid.uuid4(),
                material_id=mat.id,
                warehouse_id=wh.id,
                available_quantity=stock_qty,
                reserved_quantity=random.uniform(0, 20.0),
                minimum_stock=20.0,
                maximum_stock=1000.0,
                reorder_level=50.0,
                unit_cost=random.uniform(10.0, 150.0),
                last_stock_update=datetime.now(timezone.utc)
            )
            db.add(inv)
            
            # Initial IN transaction
            trx = InventoryTransaction(
                id=uuid.uuid4(),
                transaction_number=f"TRX-IN-{uuid.uuid4().hex[:6].upper()}",
                material_id=mat.id,
                warehouse_id=wh.id,
                transaction_type=TransactionType.IN,
                quantity=stock_qty,
                reference_type="Initial Seed",
                performed_by="System Admin",
                transaction_date=datetime.now(timezone.utc)
            )
            db.add(trx)
            
    db.commit()
    print(f"Successfully seeded {len(created_materials)} materials and inventory stock!")
    db.close()

if __name__ == "__main__":
    seed()
