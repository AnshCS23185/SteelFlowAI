from typing import List
from datetime import datetime
import uuid

from app.models.enums import DispatchPriority, TrailerCategory
from app.engine import scoring_weights
from app.schemas import DispatchRecommendation, DispatchBatch
from app.clients import module2_client, module3_client

class DispatchEngine:
    @staticmethod
    def calculate_dispatch_score(production_data: dict, inventory_data: dict) -> float:
        # 1. Completion Percentage (0.0 to 1.0)
        completion_pct = production_data.get("completion_percentage", 0.0)
        
        # 2. Remaining ETA (Inverse scaling: less days = higher score)
        # e.g. 0 days = 1.0, >10 days = 0.0
        eta_days = production_data.get("pending_eta_days", 10)
        eta_score = max(0.0, 1.0 - (eta_days / 10.0))
        
        # 3. Material Availability (0.0 to 1.0)
        mat_avail = inventory_data.get("material_availability_percent", 0.0)
        
        # 4. Delays (Penalty if there are delays in pending items)
        delay_score = 0.0 if len(production_data.get("delays", [])) > 0 else 1.0
        
        # 5. Transport Benefit (Mocked metric for demo: say 0.8)
        transport_benefit = 0.8
        
        # Weighted sum
        score = (
            (completion_pct * scoring_weights.WEIGHT_COMPLETION_PERCENT) +
            (eta_score * scoring_weights.WEIGHT_REMAINING_ETA) +
            (mat_avail * scoring_weights.WEIGHT_MATERIAL_AVAIL) +
            (delay_score * scoring_weights.WEIGHT_DELAYS) +
            (transport_benefit * scoring_weights.WEIGHT_TRANSPORT_BENEFIT)
        )
        return round(min(1.0, max(0.0, score)), 2)

    @staticmethod
    def estimate_trailer_category(weight_tons: float, volume_m3: float) -> TrailerCategory:
        # Simple heuristic mapping for trailer category
        if weight_tons < 5.0 and volume_m3 < 10.0:
            return TrailerCategory.SMALL
        elif weight_tons < 15.0 and volume_m3 < 25.0:
            return TrailerCategory.MEDIUM
        elif weight_tons < 22.0:
            return TrailerCategory.FLATBED
        elif weight_tons >= 22.0:
            return TrailerCategory.HEAVY
        return TrailerCategory.UNKNOWN

    @staticmethod
    def generate_recommendation(project_id: str) -> DispatchRecommendation:
        prod_data = module3_client.get_production_tickets(project_id)
        inv_data = module2_client.get_inventory_status(project_id)
        
        score = DispatchEngine.calculate_dispatch_score(prod_data, inv_data)
        
        if score >= scoring_weights.THRESHOLD_HIGH:
            rec_text = "Dispatch Now"
            priority = DispatchPriority.HIGH
            reason = f"High completion rate and strong score ({score*100:.0f}%)."
            benefit = "Immediate revenue generation and cleared factory space."
            risk = "None."
        elif score >= scoring_weights.THRESHOLD_MEDIUM:
            rec_text = "Partial Dispatch"
            priority = DispatchPriority.MEDIUM
            reason = f"Sufficient items are ready, but remaining items will take {prod_data.get('pending_eta_days')} days."
            benefit = "Partial revenue collection and improved cash flow."
            risk = "A second shipment may be required later, increasing transport costs."
        else:
            rec_text = "Wait & Consolidate"
            priority = DispatchPriority.LOW
            reason = f"Score is too low ({score*100:.0f}%). Remaining items will finish soon."
            benefit = "Reduced total transportation costs by consolidating shipments."
            risk = "Delayed cash flow."

        # Estimate trailer for recommendation based on ready materials
        weight = prod_data.get("ready_weight_tons", 0.0)
        volume = prod_data.get("ready_volume_m3", 0.0)
        trailer_category = DispatchEngine.estimate_trailer_category(weight, volume)

        return DispatchRecommendation(
            id=str(uuid.uuid4()),
            project_id=project_id,
            recommendation=rec_text,
            dispatch_score=score,
            confidence_score=0.92, # mock confidence
            dispatch_priority=priority,
            reason=reason,
            business_benefit=benefit,
            possible_risk=risk,
            estimated_trailer_category=trailer_category,
            created_at=datetime.utcnow()
        )

    @staticmethod
    def create_dispatch_batch(recommendation: DispatchRecommendation) -> DispatchBatch:
        prod_data = module3_client.get_production_tickets(recommendation.project_id)
        
        weight = prod_data.get("ready_weight_tons", 0.0)
        volume = prod_data.get("ready_volume_m3", 0.0)
        trailer_category = DispatchEngine.estimate_trailer_category(weight, volume)
        
        # In a real app we'd fetch the actual ready ticket IDs
        ready_tickets = [f"T-READY-{i}" for i in range(prod_data.get("ready_tickets", 0))]
        
        return DispatchBatch(
            batch_id=str(uuid.uuid4()),
            project_id=recommendation.project_id,
            selected_production_tickets=ready_tickets,
            total_weight_tons=weight,
            total_volume_m3=volume,
            estimated_trailer_category=trailer_category,
            recommendation_summary=f"{recommendation.recommendation}: {recommendation.reason}",
            created_at=datetime.utcnow(),
            status="PENDING_TRANSPORT_OPTIMIZATION"
        )
