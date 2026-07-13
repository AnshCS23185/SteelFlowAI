from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)

class Client(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clients"
    
    name = Column(String(255), index=True, nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    
    projects = relationship("Project", back_populates="client")

class Project(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "projects"
    
    title = Column(String(255), index=True, nullable=False)
    description = Column(String(1000), nullable=True)
    status = Column(String(50), default="registered")
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    
    client = relationship("Client", back_populates="projects")
    documents = relationship("Document", back_populates="project")

class Document(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "documents"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    file_url = Column(String(1000), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    project = relationship("Project", back_populates="documents")
    uploader = relationship("User")
