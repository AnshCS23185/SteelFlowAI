import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None
    bucket: AsyncIOMotorGridFSBucket = None

db = MongoDB()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.db = db.client.get_database("steelflow_docs")
    db.bucket = AsyncIOMotorGridFSBucket(db.db)
    print("Connected to MongoDB GridFS")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def get_gridfs():
    return db.bucket
