from fastapi import APIRouter, status
from schemas.user import UserCreate, UserLogin
from services.user_service import create_user, authenticate_user

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    user_id = await create_user(user)
    return {"message": "User registered successfully", "user_id": user_id}


@router.post("/login")
async def login_user(data: UserLogin):
    token = await authenticate_user(data)
    return {"access_token": token, "token_type": "bearer"}
