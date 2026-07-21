import os
import asyncio
from dotenv import load_dotenv
load_dotenv(os.path.join('c:/Users/RC/PycharmProjects/SteelFlowAI/module1-service', '.env'))

from sqlalchemy import create_engine, text
from motor.motor_asyncio import AsyncIOMotorClient

def check_postgres():
    engine = create_engine(os.getenv('DATABASE_URL'))
    with engine.connect() as conn:
        items = conn.execute(text('SELECT count(*) FROM shipping_items')).fetchone()[0]
        lists = conn.execute(text('SELECT count(*) FROM shipping_lists')).fetchone()[0]
        print(f'Neon PostgreSQL: {lists} shipping lists uploaded, containing {items} individual structural items.')

async def check_mongo():
    client = AsyncIOMotorClient(os.getenv('MONGO_URI'))
    db = client.steelflow_docs
    fs = db.fs.files
    count = await fs.count_documents({})
    print(f'MongoDB GridFS: {count} raw file(s) permanently archived.')
    client.close()

if __name__ == "__main__":
    check_postgres()
    asyncio.run(check_mongo())
