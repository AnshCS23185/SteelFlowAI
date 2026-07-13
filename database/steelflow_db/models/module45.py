from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from steelflow_db.core.base import Base, UUIDMixin, TimestampMixin

class Schedule(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "schedules"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    planned_date = Column(DateTime(timezone=True), nullable=True)
    actual_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="scheduled")
    delay_reason = Column(String(500), nullable=True)
    
    project = relationship("steelflow_db.models.module1.Project")

class ProjectHealth(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "project_health"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    health_score = Column(Float, default=100.0)
    ai_recommendation = Column(String(1000), nullable=True)
    
    project = relationship("steelflow_db.models.module1.Project")

class Trailer(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "trailers"
    
    type = Column(String(100), nullable=False)
    max_weight = Column(Float, nullable=False)
    max_volume = Column(Float, nullable=False)
    
    dispatches = relationship("Dispatch", back_populates="trailer")

class Dispatch(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "dispatches"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    trailer_id = Column(UUID(as_uuid=True), ForeignKey("trailers.id"), nullable=True)
    dispatch_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="planning")
    
    project = relationship("steelflow_db.models.module1.Project")
    trailer = relationship("Trailer", back_populates="dispatches")
