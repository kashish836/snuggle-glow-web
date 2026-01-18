"""
Community discussion schemas
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class DiscussionBase(BaseModel):
    """Base discussion schema"""
    title: str = Field(..., max_length=255)
    content: str
    category: str = Field(..., max_length=100)


class DiscussionCreate(DiscussionBase):
    """Schema for creating a discussion"""
    pass


class DiscussionUpdate(BaseModel):
    """Schema for updating a discussion"""
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    is_pinned: Optional[bool] = None
    is_locked: Optional[bool] = None


class DiscussionReplyBase(BaseModel):
    """Base discussion reply schema"""
    content: str


class DiscussionReplyCreate(DiscussionReplyBase):
    """Schema for creating a reply"""
    pass


class DiscussionReplyResponse(DiscussionReplyBase):
    """Schema for reply response"""
    id: UUID
    discussion_id: UUID
    author_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DiscussionResponse(DiscussionBase):
    """Schema for discussion response"""
    id: UUID
    author_id: Optional[UUID] = None
    reply_count: int
    view_count: int
    is_pinned: bool
    is_locked: bool
    created_at: datetime
    updated_at: datetime
    last_activity_at: datetime
    replies: Optional[list[DiscussionReplyResponse]] = None
    
    model_config = ConfigDict(from_attributes=True)


class DiscussionListResponse(BaseModel):
    """Schema for discussion list response"""
    discussions: list[DiscussionResponse]
    total: int
    page: int
    page_size: int

