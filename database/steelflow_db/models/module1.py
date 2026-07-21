import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, Enum as SQLEnum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    PROJECT_MANAGER = "project_manager"
    INVENTORY_MANAGER = "inventory_manager"
    CLIENT = "client"

class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.CLIENT, nullable=False)
    is_active = Column(Boolean, default=True)
    
    project_assignments = relationship("ProjectAssignment", back_populates="user")

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
    tonnage = Column(Integer, default=0)
    status = Column(String(50), default="registered")
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    
    client = relationship("Client", back_populates="projects")
    documents = relationship("Document", back_populates="project")
    assignments = relationship("ProjectAssignment", back_populates="project")

class ProjectAssignment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "project_assignments"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    assignment_role = Column(String(50), nullable=False) # e.g., 'manager', 'viewer'
    
    user = relationship("User", back_populates="project_assignments")
    project = relationship("Project", back_populates="assignments")

class Document(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "documents"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    document_type = Column(String(50), default="drawing")
    mongo_file_id = Column(String(255), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="active")
    
    project = relationship("Project", back_populates="documents")
    uploader = relationship("User")

class ShippingList(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "shipping_lists"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    mongo_file_id = Column(String(255), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="Parsed")
    
    project = relationship("Project")
    uploader = relationship("User")
    items = relationship("ShippingItem", back_populates="shipping_list", cascade="all, delete-orphan")

class ShippingItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "shipping_items"
    
    shipping_list_id = Column(UUID(as_uuid=True), ForeignKey("shipping_lists.id"), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    item_code = Column(String(100), index=True, nullable=False)
    description = Column(String(500), nullable=True)
    quantity = Column(String(50), nullable=True) # Usually an integer, but string allows flexibility if needed, or better float? Let's use float or string. We'll use string for now to avoid parsing errors
    weight = Column(String(50), nullable=True) 
    length = Column(String(50), nullable=True)
    width = Column(String(50), nullable=True)
    height = Column(String(50), nullable=True)
    material = Column(String(100), nullable=True)
    status = Column(String(50), default="Pending Manufacturing")
    
    shipping_list = relationship("ShippingList", back_populates="items")
    project = relationship("Project")
