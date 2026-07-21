from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
import sys
import os

db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'database'))
if db_path not in sys.path:
    sys.path.append(db_path)

from steelflow_db.core.db import get_db
from steelflow_db.models.module1 import Project, ProjectAssignment, Client, User, Document, ShippingList, ShippingItem

auth_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'shared_auth'))
if auth_path not in sys.path:
    sys.path.append(auth_path)

from steelflow_auth.rbac import get_current_user, require_permission, verify_project_access, CurrentUser
from steelflow_auth.permissions import AppModule, AccessLevel

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    tonnage: Optional[int] = 0
    client_name: str
    supervisor_id: Optional[str] = None
    client_user_id: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    tonnage: int
    status: str
    client_id: str

class AssignmentCreate(BaseModel):
    user_id: str
    assignment_role: str

@router.get("/", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.READ))
):
    if user.role == "super_admin":
        projects = db.query(Project).all()
    else:
        # RLAC: Only fetch projects assigned to the user
        assignments = db.query(ProjectAssignment).filter(ProjectAssignment.user_id == user.id).all()
        project_ids = [a.project_id for a in assignments]
        projects = db.query(Project).filter(Project.id.in_(project_ids)).all()
        
    return [ProjectResponse(
        id=str(p.id),
        title=p.title,
        description=p.description,
        tonnage=p.tonnage or 0,
        status=p.status,
        client_id=str(p.client_id)
    ) for p in projects]

@router.post("/", response_model=ProjectResponse)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    # Dynamically find or create the Client company entity
    client_name = project_in.client_name or "Unknown Client"
    client = db.query(Client).filter(Client.name == client_name).first()
    if not client:
        client = Client(name=client_name)
        db.add(client)
        db.flush() # flush to get client.id
        
    new_project = Project(
        title=project_in.title,
        description=project_in.description,
        tonnage=project_in.tonnage,
        client_id=client.id,
        status="registered"
    )
    db.add(new_project)
    db.flush() # flush to get project.id
    
    # Automatically assign the PM and Client User
    if project_in.supervisor_id:
        pm_assignment = ProjectAssignment(
            user_id=project_in.supervisor_id,
            project_id=new_project.id,
            assignment_role="project_manager"
        )
        db.add(pm_assignment)
        
    if project_in.client_user_id:
        client_assignment = ProjectAssignment(
            user_id=project_in.client_user_id,
            project_id=new_project.id,
            assignment_role="client_rep"
        )
        db.add(client_assignment)
        
    db.commit()
    db.refresh(new_project)
    
    return ProjectResponse(
        id=str(new_project.id),
        title=new_project.title,
        description=new_project.description,
        tonnage=new_project.tonnage or 0,
        status=new_project.status,
        client_id=str(new_project.client_id)
    )

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_by_id(
    project_id: UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(verify_project_access)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(
        id=str(project.id),
        title=project.title,
        description=project.description,
        tonnage=project.tonnage or 0,
        status=project.status,
        client_id=str(project.client_id)
    )

@router.post("/{project_id}/assign")
def assign_user_to_project(
    project_id: UUID,
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    target_user = db.query(User).filter(User.id == assignment.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_assignment = ProjectAssignment(
        user_id=assignment.user_id,
        project_id=project_id,
        assignment_role=assignment.assignment_role
    )
    db.add(new_assignment)
    db.commit()
    
    return {"message": "Project assigned successfully"}

@router.delete("/{project_id}")
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Safe cascade cleanup
    # 1. Delete shipping items belonging to shipping lists of this project
    shipping_lists = db.query(ShippingList).filter(ShippingList.project_id == project.id).all()
    shipping_list_ids = [sl.id for sl in shipping_lists]
    if shipping_list_ids:
        db.query(ShippingItem).filter(ShippingItem.shipping_list_id.in_(shipping_list_ids)).delete(synchronize_session=False)

    # 2. Delete shipping lists
    db.query(ShippingList).filter(ShippingList.project_id == project.id).delete(synchronize_session=False)

    # 3. Delete documents
    db.query(Document).filter(Document.project_id == project.id).delete(synchronize_session=False)

    # 4. Delete project assignments
    db.query(ProjectAssignment).filter(ProjectAssignment.project_id == project.id).delete(synchronize_session=False)

    # 5. Finally, delete the project
    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully"}
