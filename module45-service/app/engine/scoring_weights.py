# Scoring Weights for Dispatch Intelligence Engine

WEIGHT_COMPLETION_PERCENT = 0.35
WEIGHT_REMAINING_ETA = 0.25
WEIGHT_MATERIAL_AVAIL = 0.15
WEIGHT_DELAYS = 0.10
WEIGHT_TRANSPORT_BENEFIT = 0.15

# Thresholds for converting score to recommendation
THRESHOLD_HIGH = 0.70    # Dispatch Now
THRESHOLD_MEDIUM = 0.40  # Partial Dispatch / Review
# Below THRESHOLD_MEDIUM -> Wait
