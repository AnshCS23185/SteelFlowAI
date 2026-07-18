from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.enums import DispatchPriority, TrailerCategory

class DispatchRecommendation(BaseModel):
    id: str
    project_id: str
    recommendation: str
    dispatch_score: float
    confidence_score: float
    dispatch_priority: DispatchPriority
    reason: str
    business_benefit: str
    possible_risk: str
    estimated_trailer_category: TrailerCategory
    created_at: datetime
    
class DispatchBatch(BaseModel):
    batch_id: str
    project_id: str
    selected_production_tickets: List[str]
    total_weight_tons: float
    total_volume_m3: float
    estimated_trailer_category: TrailerCategory
    recommendation_summary: str
    created_at: datetime
    status: str

class DispatchKPIs(BaseModel):
    project_id: str
    estimated_immediate_revenue: float
    potential_transport_savings: float
    dispatch_readiness_percentage: float
    recommended_dispatch_batches: int
    ready_weight_tons: float
    ready_volume_m3: float
    ready_tickets: int
    pending_tickets: int
