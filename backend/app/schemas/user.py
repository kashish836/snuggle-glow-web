"""
User and Profile schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user creation"""
    password: str = Field(..., min_length=8, max_length=100)
    display_name: Optional[str] = Field(None, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response"""
    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ProfileBase(BaseModel):
    """Base profile schema"""
    display_name: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = Field(None, max_length=2048)
    bio: Optional[str] = Field(None, max_length=500)
    theme_preference: str = Field(default="light", max_length=20)
    notifications_enabled: bool = Field(default=True)


class ProfileCreate(ProfileBase):
    """Schema for profile creation"""
    user_id: UUID


class ProfileUpdate(BaseModel):
    """Schema for profile update"""
    display_name: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = Field(None, max_length=2048)
    bio: Optional[str] = Field(None, max_length=500)
    theme_preference: Optional[str] = Field(None, max_length=20)
    notifications_enabled: Optional[bool] = None


class ProfileResponse(ProfileBase):
    """Schema for profile response"""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token data schema"""
    user_id: Optional[UUID] = None


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema"""
    refresh_token: str

