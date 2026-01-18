"""
Resource schemas
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class ResourceBase(BaseModel):
    """Base resource schema"""
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    category: str = Field(..., max_length=100)
    resource_type: str = Field(..., max_length=50)
    file_url: Optional[str] = None
    is_featured: bool = Field(default=False)


class ResourceCreate(ResourceBase):
    """Schema for creating a resource"""
    pass


class ResourceUpdate(BaseModel):
    """Schema for updating a resource"""
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    resource_type: Optional[str] = Field(None, max_length=50)
    file_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class ResourceResponse(ResourceBase):
    """Schema for resource response"""
    id: UUID
    author_id: Optional[UUID] = None
    download_count: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ResourceListResponse(BaseModel):
    """Schema for resource list response"""
    resources: list[ResourceResponse]
    total: int
    page: int
    page_size: int

