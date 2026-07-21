import os
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'module1-service', '.env')
load_dotenv(dotenv_path)

from sqlalchemy.orm import Session
from steelflow_db.core.db import SessionLocal
from steelflow_db.models.module1 import User, Project, Client, ProjectAssignment, ShippingItem, ShippingList, Document

def clean_database():
    db = SessionLocal()
    try:
        print("Cleaning database...")
        
        # 1. Delete all ShippingItems
        deleted_shipping_items = db.query(ShippingItem).delete()
        print(f"Deleted {deleted_shipping_items} shipping items.")
        
        # 2. Delete all ShippingLists
        deleted_shipping_lists = db.query(ShippingList).delete()
        print(f"Deleted {deleted_shipping_lists} shipping lists.")
        
        # 3. Delete all Documents
        deleted_docs = db.query(Document).delete()
        print(f"Deleted {deleted_docs} documents.")
        
        # 4. Delete all ProjectAssignments (this fixes the foreign key issue)
        deleted_assignments = db.query(ProjectAssignment).delete()
        print(f"Deleted {deleted_assignments} project assignments.")
        
        # 5. Delete all Projects
        deleted_projects = db.query(Project).delete()
        print(f"Deleted {deleted_projects} projects.")
        
        # 6. Delete all Clients
        deleted_clients = db.query(Client).delete()
        print(f"Deleted {deleted_clients} clients.")
        
        # 7. Delete all Users EXCEPT admin@gmail.com
        deleted_users = db.query(User).filter(User.email != 'admin@gmail.com').delete(synchronize_session=False)
        print(f"Deleted {deleted_users} mock users.")
        
        db.commit()
        print("Database cleaned successfully. Only Admin remains.")
        
    except Exception as e:
        print(f"Error cleaning database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()
