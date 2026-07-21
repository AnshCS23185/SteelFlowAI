import os
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'module1-service', '.env')
load_dotenv(dotenv_path)

from sqlalchemy import text
from steelflow_db.core.db import engine

def add_col():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE projects ADD COLUMN tonnage INTEGER DEFAULT 0;"))
            conn.commit()
            print("Column tonnage added.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    add_col()
