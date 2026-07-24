from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import sys
import os

# Add db to path
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'database'))
if db_path not in sys.path:
    sys.path.append(db_path)

from steelflow_db.core.db import get_db
from steelflow_db.models.module1 import User

# Add auth to path
auth_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'shared_auth'))
if auth_path not in sys.path:
    sys.path.append(auth_path)

from steelflow_auth.jwt_utils import create_access_token
from passlib.context import CryptContext

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except ValueError:
        return False

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)}
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value if hasattr(user.role, 'value') else user.role
        }
    }
