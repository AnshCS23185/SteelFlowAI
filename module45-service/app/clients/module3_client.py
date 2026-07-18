# module3_client.py
# Mock client for fetching production ticket data

def get_production_tickets(project_id: str):
    """
    Mock function to get the status of production tickets from Module 3.
    """
    # Mock data:
    # Let's say we have 10 tickets, 6 are ready, 4 are pending with some delay.
    return {
        "project_id": project_id,
        "total_tickets": 10,
        "ready_tickets": 6,
        "pending_tickets": 4,
        "completion_percentage": 0.60,
        "ready_weight_tons": 24.5,
        "ready_volume_m3": 15.0,
        "pending_eta_days": 4,
        "delays": [
            {"ticket": "T-1004", "reason": "Welding machine breakdown"}
        ]
    }
