"""
Blog post schemas
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class BlogPostBase(BaseModel):
    """Base blog post schema"""
    title: str = Field(..., max_length=255)
    excerpt: Optional[str] = None
    content: str
    category: str = Field(..., max_length=100)
    read_time: int = Field(default=5, ge=1, le=60)
    featured: bool = Field(default=False)


class BlogPostCreate(BlogPostBase):
    """Schema for creating a blog post"""
    published: bool = Field(default=False)


class BlogPostUpdate(BaseModel):
    """Schema for updating a blog post"""
    title: Optional[str] = Field(None, max_length=255)
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    read_time: Optional[int] = Field(None, ge=1, le=60)
    featured: Optional[bool] = None
    published: Optional[bool] = None


class BlogPostResponse(BlogPostBase):
    """Schema for blog post response"""
    id: UUID
    slug: str
    author_id: Optional[UUID] = None
    views: int
    published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class BlogPostListResponse(BaseModel):
    """Schema for blog post list response"""
    posts: list[BlogPostResponse]
    total: int
    page: int
    page_size: int

