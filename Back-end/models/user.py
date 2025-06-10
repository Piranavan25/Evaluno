from pymongo import IndexModel
from pymongo.collection import Collection
from database.connection import db

def create_user_model():
    users_collection: Collection = db["users"]
    
    # Create indexes
    users_collection.create_indexes([
        IndexModel([("email", 1)], unique=True),
        IndexModel([("username", 1)], unique=True)
    ])
    
    return users_collection