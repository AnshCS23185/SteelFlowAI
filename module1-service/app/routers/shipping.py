from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
import pandas as pd
import io
import sys
import os

db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'database'))
if db_path not in sys.path:
    sys.path.append(db_path)

from steelflow_db.core.db import get_db
from steelflow_db.models.module1 import Project, ShippingList, ShippingItem

auth_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'shared_auth'))
if auth_path not in sys.path:
    sys.path.append(auth_path)

from steelflow_auth.rbac import verify_project_access, CurrentUser
from app.core.mongo_db import get_gridfs

router = APIRouter(prefix="/api/v1/projects", tags=["shipping"])

class ShippingItemResponse(BaseModel):
    id: str
    shipping_list_id: str
    item_code: str
    description: Optional[str] = None
    quantity: Optional[str] = None
    weight: Optional[str] = None
    length: Optional[str] = None
    width: Optional[str] = None
    height: Optional[str] = None
    material: Optional[str] = None
    status: str

class ShippingListResponse(BaseModel):
    id: str
    original_filename: str
    mongo_file_id: str
    uploaded_by: str
    status: str
    created_at: str

@router.post("/{project_id}/shipping-lists", response_model=ShippingListResponse)
async def upload_shipping_list(
    project_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(verify_project_access),
    bucket = Depends(get_gridfs)
):
    # 1. Validate Project & File Extension
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    ext = file.filename.split('.')[-1].lower()
    if ext not in ['xlsx', 'csv']:
        raise HTTPException(status_code=422, detail="Only .xlsx or .csv files are supported")

    # 2. Read the file into memory
    contents = await file.read()
    
    # 3. Stream to MongoDB GridFS for the audit trail
    file_id = await bucket.upload_from_stream(
        file.filename,
        contents,
        metadata={"project_id": str(project_id), "uploaded_by": user.id, "type": "shipping_list"}
    )
    
    # 4. Initiate DB Transaction in Neon
    try:
        # Create Metadata row
        shipping_list = ShippingList(
            project_id=project_id,
            original_filename=file.filename,
            mongo_file_id=str(file_id),
            uploaded_by=UUID(user.id),
            status="Processing"
        )
        db.add(shipping_list)
        db.flush() # flush to get the shipping_list.id
        
        # 5. Parse File using pandas
        if ext == 'csv':
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        # Optional: Clean column names to make matching easier
        df.columns = [str(c).strip().lower() for c in df.columns]
        
        # Look for a column that could be item_code
        item_code_col = next((c for c in df.columns if 'code' in c or 'mark' in c or 'id' in c), None)
        if not item_code_col:
            # Fallback to the first column if no explicit code column is found
            item_code_col = df.columns[0]
            
        description_col = next((c for c in df.columns if 'desc' in c or 'name' in c), None)
        qty_col = next((c for c in df.columns if 'qty' in c or 'quantity' in c or 'count' in c), None)
        weight_col = next((c for c in df.columns if 'weight' in c or 'mass' in c), None)
        length_col = next((c for c in df.columns if 'length' in c or 'len' in c), None)
        width_col = next((c for c in df.columns if 'width' in c or 'wid' in c), None)
        height_col = next((c for c in df.columns if 'height' in c or 'depth' in c), None)
        mat_col = next((c for c in df.columns if 'mat' in c or 'grade' in c), None)

        shipping_items = []
        for index, row in df.iterrows():
            item_code = str(row[item_code_col]) if item_code_col and pd.notna(row[item_code_col]) else f"UNKNOWN-{index}"
            if item_code == "nan" or not item_code.strip():
                continue # Skip empty rows
                
            item = ShippingItem(
                shipping_list_id=shipping_list.id,
                project_id=project_id,
                item_code=item_code,
                description=str(row[description_col]) if description_col and pd.notna(row[description_col]) else None,
                quantity=str(row[qty_col]) if qty_col and pd.notna(row[qty_col]) else "1",
                weight=str(row[weight_col]) if weight_col and pd.notna(row[weight_col]) else None,
                length=str(row[length_col]) if length_col and pd.notna(row[length_col]) else None,
                width=str(row[width_col]) if width_col and pd.notna(row[width_col]) else None,
                height=str(row[height_col]) if height_col and pd.notna(row[height_col]) else None,
                material=str(row[mat_col]) if mat_col and pd.notna(row[mat_col]) else None
            )
            shipping_items.append(item)
            
        if not shipping_items:
            raise ValueError("No valid items found in file to parse")
            
        # Bulk Insert
        db.add_all(shipping_items)
        shipping_list.status = "Parsed"
        
        db.commit()
        db.refresh(shipping_list)
        
        return ShippingListResponse(
            id=str(shipping_list.id),
            original_filename=shipping_list.original_filename,
            mongo_file_id=shipping_list.mongo_file_id,
            uploaded_by=str(shipping_list.uploaded_by),
            status=shipping_list.status,
            created_at=shipping_list.created_at.isoformat() if shipping_list.created_at else ""
        )
        
    except Exception as e:
        db.rollback() # Important: rollback neon transaction
        # Clean up mongo file if possible
        try:
            await bucket.delete(file_id)
        except Exception:
            pass
        raise HTTPException(status_code=422, detail=f"Failed to process file: {str(e)}")

@router.get("/{project_id}/shipping-lists", response_model=List[ShippingListResponse])
def get_shipping_lists(
    project_id: UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(verify_project_access)
):
    lists = db.query(ShippingList).filter(ShippingList.project_id == project_id).order_by(ShippingList.created_at.desc()).all()
    return [
        ShippingListResponse(
            id=str(sl.id),
            original_filename=sl.original_filename,
            mongo_file_id=sl.mongo_file_id,
            uploaded_by=str(sl.uploaded_by),
            status=sl.status,
            created_at=sl.created_at.isoformat() if sl.created_at else ""
        ) for sl in lists
    ]

@router.get("/{project_id}/shipping-items", response_model=List[ShippingItemResponse])
def get_shipping_items(
    project_id: UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(verify_project_access)
):
    items = db.query(ShippingItem).filter(ShippingItem.project_id == project_id).all()
    return [
        ShippingItemResponse(
            id=str(i.id),
            shipping_list_id=str(i.shipping_list_id),
            item_code=i.item_code,
            description=i.description,
            quantity=i.quantity,
            weight=i.weight,
            length=i.length,
            width=i.width,
            height=i.height,
            material=i.material,
            status=i.status
        ) for i in items
    ]
