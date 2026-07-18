# module2_client.py
# Mock client for fetching inventory/material data

def get_inventory_status(project_id: str):
    """
    Mock function to represent checking material availability from Module 2.
    Returns an availability percentage and any specific shortages.
    """
    # Mock behavior: we have 90% availability
    return {
        "project_id": project_id,
        "material_availability_percent": 0.90,
        "shortages": [
            {"item": "Steel Plate 15mm", "status": "Procuring"}
        ]
    }
