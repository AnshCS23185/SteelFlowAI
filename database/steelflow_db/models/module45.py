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

class DispatchRecommendation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "dispatch_recommendations"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    dispatch_score = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    recommendation = Column(String(255), nullable=False)
    reason = Column(String(1000), nullable=True)
    business_benefit = Column(String(1000), nullable=True)
    possible_risk = Column(String(1000), nullable=True)
    dispatch_priority = Column(String(50), nullable=False)
    estimated_trailer_category = Column(String(50), nullable=False)
    
    project = relationship("steelflow_db.models.module1.Project")
    batches = relationship("DispatchBatch", back_populates="recommendation")

class DispatchBatch(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "dispatch_batches"
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    recommendation_id = Column(UUID(as_uuid=True), ForeignKey("dispatch_recommendations.id"), nullable=False)
    total_weight_tons = Column(Float, nullable=False)
    total_volume_m3 = Column(Float, nullable=False)
    estimated_trailer_category = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="PENDING_TRANSPORT_OPTIMIZATION")
    
    project = relationship("steelflow_db.models.module1.Project")
    recommendation = relationship("DispatchRecommendation", back_populates="batches")
    tickets = relationship("DispatchBatchTicket", back_populates="batch")

class DispatchBatchTicket(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "dispatch_batch_tickets"
    
    batch_id = Column(UUID(as_uuid=True), ForeignKey("dispatch_batches.id"), nullable=False)
    ticket_id = Column(String(100), nullable=False)
    
    batch = relationship("DispatchBatch", back_populates="tickets")
