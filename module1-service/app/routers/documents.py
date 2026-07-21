from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from uuid import UUID
import sys
import os

db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'database'))
if db_path not in sys.path:
    sys.path.append(db_path)

from steelflow_db.core.db import get_db
from steelflow_db.models.module1 import Document, Project

auth_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'shared_auth'))
if auth_path not in sys.path:
    sys.path.append(auth_path)

from steelflow_auth.rbac import get_current_user, verify_project_access, CurrentUser
from app.core.mongo_db import get_gridfs

router = APIRouter(prefix="/api/v1/projects", tags=["documents"])

class DocumentResponse(BaseModel):
    id: str
    project_id: str
    file_name: str
    mongo_file_id: str
    uploaded_by: str

@router.get("/{project_id}/documents", response_model=List[DocumentResponse])
def get_project_documents(
    project_id: UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(verify_project_access)
):
    docs = db.query(Document).filter(Document.project_id == project_id).all()
    return [DocumentResponse(
        id=str(d.id),
        project_id=str(d.project_id),
        file_name=d.file_name,
        mongo_file_id=d.mongo_file_id,
        uploaded_by=str(d.uploaded_by)
    ) for d in docs]

@router.post("/{project_id}/documents", response_model=DocumentResponse)
async def upload_document(
    project_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(verify_project_access),
    bucket = Depends(get_gridfs)
):
    # Ensure project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Read the file
    contents = await file.read()
    
    # Upload to GridFS
    file_id = await bucket.upload_from_stream(
        file.filename,
        contents,
        metadata={"project_id": str(project_id), "uploaded_by": user.id}
    )
    
    # Save metadata to Neon DB
    new_doc = Document(
        project_id=project_id,
        file_name=file.filename,
        mongo_file_id=str(file_id),
        uploaded_by=UUID(user.id)
    )
    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    return DocumentResponse(
        id=str(new_doc.id),
        project_id=str(new_doc.project_id),
        file_name=new_doc.file_name,
        mongo_file_id=new_doc.mongo_file_id,
        uploaded_by=str(new_doc.uploaded_by)
    )
