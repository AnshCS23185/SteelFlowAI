from fastapi import Header, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from uuid import UUID
from .permissions import ROLE_PERMISSIONS, AppModule, AccessLevel
from .jwt_utils import decode_access_token

import sys
import os

# Dynamically add the database folder to sys.path so we can import steelflow_db
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'database'))
if db_path not in sys.path:
    sys.path.append(db_path)

from steelflow_db.core.db import get_db
from steelflow_db.models.module1 import User, ProjectAssignment
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

class CurrentUser:
    def __init__(self, id: str, email: str, role: str):
        self.id = id
        self.email = email
        self.role = role

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> CurrentUser:
    """
    Decodes the JWT token and fetches the user from the database.
    """
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
        
    return CurrentUser(id=str(user.id), email=user.email, role=user.role)

def require_permission(module: AppModule, required_level: AccessLevel):
    """
    PBAC Dependency Factory.
    Verifies that the current user's role has the required access level for the module.
    """
    def permission_checker(user: CurrentUser = Depends(get_current_user)):
        user_permissions = ROLE_PERMISSIONS.get(user.role, {})
        actual_level = user_permissions.get(module, AccessLevel.NONE)
        
        # Simple hierarchy: FULL > READ > NONE
        # ASSIGNED is special, it implies READ/WRITE but only for assigned resources
        
        if required_level == AccessLevel.NONE:
            return user
            
        if actual_level == AccessLevel.FULL:
            return user
            
        if required_level == AccessLevel.READ and actual_level in (AccessLevel.READ, AccessLevel.ASSIGNED):
            return user
            
        if required_level == AccessLevel.ASSIGNED and actual_level == AccessLevel.ASSIGNED:
            return user
            
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{user.role}' has insufficient permissions ({actual_level}) for module '{module.value}'. Required: {required_level}"
        )
    return permission_checker

def verify_project_access(project_id: UUID, user: CurrentUser = Depends(get_current_user), db: "Session" = Depends(get_db)):
    """
    RLAC Dependency.
    Verifies that the user is explicitly assigned to the specific project in the database.
    Super Admins bypass this check.
    """
    if user.role == "super_admin":
        return user
        
    # Get the actual user object from DB using the ID
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in database")
        
    # Check assignment
    assignment = db.query(ProjectAssignment).filter(
        ProjectAssignment.user_id == db_user.id,
        ProjectAssignment.project_id == project_id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User is not assigned to project {project_id}"
        )
        
    return user
