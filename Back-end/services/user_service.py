from database.connection import user_collection
from utils.helpers import hash_password, verify_password, create_access_token
from schemas.user import UserCreate, UserLogin
from fastapi import HTTPException
from bson import ObjectId


async def create_user(user: UserCreate):
    existing = await user_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)

    result = await user_collection.insert_one(user_dict)
    return str(result.inserted_id)


async def authenticate_user(data: UserLogin):
    user = await user_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user["email"],
        "username": user["username"],
        "user_type": user["user_type"],
        "user_id": str(user["_id"])  
    })

    return token
