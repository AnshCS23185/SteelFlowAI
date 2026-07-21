from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import sys
import os

db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'database'))
if db_path not in sys.path:
    sys.path.append(db_path)

from steelflow_db.core.db import get_db
from steelflow_db.models.module1 import User, UserRole, ProjectAssignment

auth_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'shared_auth'))
if auth_path not in sys.path:
    sys.path.append(auth_path)

from steelflow_auth.rbac import get_current_user, require_permission, CurrentUser
from steelflow_auth.permissions import AppModule, AccessLevel
from passlib.context import CryptContext

router = APIRouter(prefix="/api/v1/users", tags=["users"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str

class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role: str | None = None

class UserResponse(BaseModel):
    id: str
    full_name: str | None
    email: str
    role: str
    is_active: bool

@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    # Only super admin should see all users
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    users = db.query(User).all()
    return [UserResponse(id=str(u.id), full_name=u.full_name, email=u.email, role=u.role.value if hasattr(u.role, 'value') else u.role, is_active=u.is_active) for u in users]

@router.post("/", response_model=UserResponse)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pwd = pwd_context.hash(user_in.password)
    db_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=hashed_pwd,
        role=user_in.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return UserResponse(id=str(db_user.id), full_name=db_user.full_name, email=db_user.email, role=db_user.role.value if hasattr(db_user.role, 'value') else db_user.role, is_active=db_user.is_active)

@router.post("/{user_id}/toggle-status", response_model=UserResponse)
def toggle_user_status(
    user_id: str,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if str(target_user.id) == user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
        
    target_user.is_active = not target_user.is_active
    db.commit()
    db.refresh(target_user)
    return UserResponse(id=str(target_user.id), full_name=target_user.full_name, email=target_user.email, role=target_user.role.value if hasattr(target_user.role, 'value') else target_user.role, is_active=target_user.is_active)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_in.email and user_in.email != target_user.email:
        if db.query(User).filter(User.email == user_in.email).first():
            raise HTTPException(status_code=400, detail="Email already taken")
        target_user.email = user_in.email

    if user_in.full_name is not None:
        target_user.full_name = user_in.full_name
        
    if user_in.role is not None:
        target_user.role = user_in.role
        
    if user_in.password:
        target_user.hashed_password = pwd_context.hash(user_in.password)
        
    db.commit()
    db.refresh(target_user)
    return UserResponse(id=str(target_user.id), full_name=target_user.full_name, email=target_user.email, role=target_user.role.value if hasattr(target_user.role, 'value') else target_user.role, is_active=target_user.is_active)

@router.delete("/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_permission(AppModule.MODULE1_PROJECTS, AccessLevel.FULL))
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if target_user.email == 'admin@gmail.com':
        raise HTTPException(status_code=403, detail="Cannot delete the primary administrator")
        
    if str(target_user.id) == user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    # Clean up project assignments
    db.query(ProjectAssignment).filter(ProjectAssignment.user_id == target_user.id).delete()
    
    db.delete(target_user)
    db.commit()
    return {"message": "User deleted successfully"}
