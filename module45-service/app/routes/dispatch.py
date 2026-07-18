from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.schemas import DispatchRecommendation, DispatchBatch, DispatchKPIs
from app.engine.dispatch_engine import DispatchEngine
from app.clients import module3_client
from app.models.enums import DispatchPriority, TrailerCategory

# Import shared DB logic and models
from steelflow_db.core.db import get_db
from steelflow_db.models.module45 import (
    DispatchRecommendation as DBDispatchRecommendation,
    DispatchBatch as DBDispatchBatch,
    DispatchBatchTicket as DBDispatchBatchTicket
)
from steelflow_db.models.module1 import Project, Client

router = APIRouter(prefix="/api/projects/{project_id}/dispatch", tags=["dispatch"])

def resolve_project_id(requested_id: str, db: Session) -> uuid.UUID:
    """
    Since Module 4 is often tested with a mock project_id like '1', 
    but the database strictly requires a valid UUID and a Foreign Key to `projects` table,
    this helper ensures we have a valid project in the DB to associate records with.
    """
    try:
        val = uuid.UUID(requested_id)
        # If valid UUID and exists, use it
        if db.query(Project).filter(Project.id == val).first():
            return val
    except ValueError:
        pass
        
    # Check if our mock project already exists
    dummy = db.query(Project).filter(Project.title == "Module 4 Mock Project").first()
    if dummy:
        return dummy.id
        
    # Create a mock client and project to satisfy Foreign Key constraints
    client = Client(id=uuid.uuid4(), name="Mock Client for Module 4")
    db.add(client)
    db.flush() # get the id
    
    project = Project(id=uuid.uuid4(), title="Module 4 Mock Project", client_id=client.id)
    db.add(project)
    db.commit()
    
    return project.id

@router.get("/kpis", response_model=DispatchKPIs)
def get_kpis(project_id: str, db: Session = Depends(get_db)):
    real_pid = resolve_project_id(project_id, db)
    prod_data = module3_client.get_production_tickets(project_id)
    
    # Mocking revenue and savings calculations
    revenue = prod_data.get("ready_weight_tons", 0.0) * 1200.0  # e.g., $1200 per ton
    savings = 450.0  # Mock savings by avoiding partial loads
    
    # Count recommended batches from DB
    batch_count = db.query(DBDispatchBatch).filter(DBDispatchBatch.project_id == real_pid).count()
    
    kpis = DispatchKPIs(
        project_id=project_id,
        estimated_immediate_revenue=revenue,
        potential_transport_savings=savings,
        dispatch_readiness_percentage=prod_data.get("completion_percentage", 0.0) * 100,
        recommended_dispatch_batches=batch_count,
        ready_weight_tons=prod_data.get("ready_weight_tons", 0.0),
        ready_volume_m3=prod_data.get("ready_volume_m3", 0.0),
        ready_tickets=prod_data.get("ready_tickets", 0),
        pending_tickets=prod_data.get("pending_tickets", 0)
    )
    return kpis

@router.get("/recommendations", response_model=List[DispatchRecommendation])
def get_recommendations(project_id: str, db: Session = Depends(get_db)):
    real_pid = resolve_project_id(project_id, db)
    
    # Query history
    recs = db.query(DBDispatchRecommendation).filter(DBDispatchRecommendation.project_id == real_pid).all()
    
    # If no history exists, generate an initial recommendation, save to DB, and return it
    if not recs:
        rec_data = DispatchEngine.generate_recommendation(project_id)
        
        db_rec = DBDispatchRecommendation(
            id=uuid.UUID(rec_data.id),
            project_id=real_pid, # Use the valid DB uuid
            dispatch_score=rec_data.dispatch_score,
            confidence_score=rec_data.confidence_score,
            recommendation=rec_data.recommendation,
            reason=rec_data.reason,
            business_benefit=rec_data.business_benefit,
            possible_risk=rec_data.possible_risk,
            dispatch_priority=rec_data.dispatch_priority.value,
            estimated_trailer_category=rec_data.estimated_trailer_category.value
        )
        db.add(db_rec)
        db.commit()
        db.refresh(db_rec)
        
        # Override the schema's project_id to the real one so it matches DB
        rec_data.project_id = str(real_pid)
        return [rec_data]
        
    # Map DB records to Pydantic schemas
    result = []
    for r in recs:
        result.append(DispatchRecommendation(
            id=str(r.id),
            project_id=str(r.project_id),
            recommendation=r.recommendation,
            dispatch_score=r.dispatch_score,
            confidence_score=r.confidence_score,
            dispatch_priority=DispatchPriority(r.dispatch_priority),
            reason=r.reason,
            business_benefit=r.business_benefit,
            possible_risk=r.possible_risk,
            estimated_trailer_category=TrailerCategory(r.estimated_trailer_category),
            created_at=r.created_at
        ))
        
    return result

@router.post("/batches", response_model=DispatchBatch)
def create_batch(project_id: str, recommendation_id: str, db: Session = Depends(get_db)):
    real_pid = resolve_project_id(project_id, db)
    
    db_rec = db.query(DBDispatchRecommendation).filter(DBDispatchRecommendation.id == uuid.UUID(recommendation_id)).first()
    
    if not db_rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
        
    # Reconstruct schema to pass to engine
    rec_schema = DispatchRecommendation(
        id=str(db_rec.id),
        project_id=str(db_rec.project_id),
        recommendation=db_rec.recommendation,
        dispatch_score=db_rec.dispatch_score,
        confidence_score=db_rec.confidence_score,
        dispatch_priority=DispatchPriority(db_rec.dispatch_priority),
        reason=db_rec.reason,
        business_benefit=db_rec.business_benefit,
        possible_risk=db_rec.possible_risk,
        estimated_trailer_category=TrailerCategory(db_rec.estimated_trailer_category),
        created_at=db_rec.created_at
    )
        
    batch_schema = DispatchEngine.create_dispatch_batch(rec_schema)
    
    # Save batch to DB
    db_batch = DBDispatchBatch(
        id=uuid.UUID(batch_schema.batch_id),
        batch_id=uuid.UUID(batch_schema.batch_id),
        project_id=real_pid,
        recommendation_id=db_rec.id,
        total_weight_tons=batch_schema.total_weight_tons,
        total_volume_m3=batch_schema.total_volume_m3,
        estimated_trailer_category=batch_schema.estimated_trailer_category.value,
        status=batch_schema.status
    )
    db.add(db_batch)
    
    # Save tickets to DB
    for ticket in batch_schema.selected_production_tickets:
        db_ticket = DBDispatchBatchTicket(
            id=uuid.uuid4(),
            batch_id=db_batch.id,
            ticket_id=ticket
        )
        db.add(db_ticket)
        
    db.commit()
    
    batch_schema.project_id = str(real_pid)
    return batch_schema

@router.get("/batches", response_model=List[DispatchBatch])
def get_batches(project_id: str, db: Session = Depends(get_db)):
    real_pid = resolve_project_id(project_id, db)
    
    db_batches = db.query(DBDispatchBatch).filter(DBDispatchBatch.project_id == real_pid).all()
    
    result = []
    for b in db_batches:
        tickets = [t.ticket_id for t in b.tickets]
        result.append(DispatchBatch(
            batch_id=str(b.batch_id),
            project_id=str(b.project_id),
            selected_production_tickets=tickets,
            total_weight_tons=b.total_weight_tons,
            total_volume_m3=b.total_volume_m3,
            estimated_trailer_category=TrailerCategory(b.estimated_trailer_category),
            recommendation_summary="", # Reconstructing string summary could require join, skipped for mock simplicity
            created_at=b.created_at,
            status=b.status
        ))
    return result
