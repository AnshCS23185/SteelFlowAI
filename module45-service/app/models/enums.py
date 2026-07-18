from enum import Enum

class DispatchPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

class TrailerCategory(str, Enum):
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    LARGE = "LARGE"
    FLATBED = "FLATBED"
    HEAVY = "HEAVY"
    UNKNOWN = "UNKNOWN"
