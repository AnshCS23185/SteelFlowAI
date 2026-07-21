import os
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'module1-service', '.env')
load_dotenv(dotenv_path)

from sqlalchemy.orm import Session
from sqlalchemy import text
from passlib.context import CryptContext
from steelflow_db.core.db import SessionLocal, engine
from steelflow_db.models.module1 import User, UserRole, Project, Client, ProjectAssignment
from steelflow_db.core.base import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_database():
    print("Dropping old tables to rebuild...")
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE; CREATE SCHEMA public;"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        print("Seeding database...")
        
        # 1. Check if super admin exists
        super_admin = db.query(User).filter(User.email == "admin@gmail.com").first()
        if not super_admin:
            super_admin = User(
                email="admin@gmail.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.SUPER_ADMIN,
                is_active=True
            )
            db.add(super_admin)
            print("Added Super Admin")

        # 2. Check if inventory manager exists
        inv_manager = db.query(User).filter(User.email == "inventory@gmail.com").first()
        if not inv_manager:
            inv_manager = User(
                email="inventory@gmail.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.INVENTORY_MANAGER,
                is_active=True
            )
            db.add(inv_manager)
            print("Added Inventory Manager")

        # 3. Check if project manager exists
        proj_manager = db.query(User).filter(User.email == "supervisor@gmail.com").first()
        if not proj_manager:
            proj_manager = User(
                email="supervisor@gmail.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.PROJECT_MANAGER,
                is_active=True
            )
            db.add(proj_manager)
            print("Added Project Manager")

        # 4. Check if client user exists
        client_user = db.query(User).filter(User.email == "client@gmail.com").first()
        if not client_user:
            client_user = User(
                email="client@gmail.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.CLIENT,
                is_active=True
            )
            db.add(client_user)
            print("Added Client User")

        db.commit()

        # Seed a dummy client company
        client_co = db.query(Client).filter(Client.email == "company@client.com").first()
        if not client_co:
            client_co = Client(
                name="Acme Corp",
                email="company@client.com",
            )
            db.add(client_co)
            db.commit()
            print("Added Client Company")

        # Seed a dummy project
        project = db.query(Project).filter(Project.title == "Project Alpha").first()
        if not project:
            project = Project(
                title="Project Alpha",
                description="Dummy project for testing RLAC",
                client_id=client_co.id
            )
            db.add(project)
            db.commit()
            print("Added Dummy Project")

        # Link Project Manager and Client to the Project
        pm_assignment = db.query(ProjectAssignment).filter(
            ProjectAssignment.user_id == proj_manager.id,
            ProjectAssignment.project_id == project.id
        ).first()
        if not pm_assignment:
            pm_assignment = ProjectAssignment(
                user_id=proj_manager.id,
                project_id=project.id,
                assignment_role="project_manager"
            )
            db.add(pm_assignment)
            print("Assigned PM to Project")

        client_assignment = db.query(ProjectAssignment).filter(
            ProjectAssignment.user_id == client_user.id,
            ProjectAssignment.project_id == project.id
        ).first()
        if not client_assignment:
            client_assignment = ProjectAssignment(
                user_id=client_user.id,
                project_id=project.id,
                assignment_role="client_viewer"
            )
            db.add(client_assignment)
            print("Assigned Client to Project")

        db.commit()
        print("Database seeding completed successfully.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
