"""
Contact and newsletter schemas
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class ContactMessageCreate(BaseModel):
    """Schema for contact form submission"""
    first_name: str = Field(..., max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    email: EmailStr
    topic: str = Field(..., max_length=100)
    message: str = Field(..., max_length=5000)
    newsletter: bool = Field(default=False)


class ContactMessageResponse(BaseModel):
    """Schema for contact message response"""
    id: UUID
    first_name: str
    last_name: Optional[str] = None
    email: str
    topic: str
    message: str
    newsletter_subscribed: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class NewsletterSubscribe(BaseModel):
    """Schema for newsletter subscription"""
    email: EmailStr


class NewsletterSubscriberResponse(BaseModel):
    """Schema for newsletter subscriber response"""
    id: UUID
    email: str
    is_active: bool
    subscribed_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

