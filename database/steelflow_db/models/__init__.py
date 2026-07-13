# Models initialization
from steelflow_db.core.base import Base

# Import all models here so Alembic can find them easily
from .module1 import User, Client, Project, Document
from .module23 import Supplier, Material, Inventory, ProductionJob
from .module45 import Schedule, ProjectHealth, Trailer, Dispatch
