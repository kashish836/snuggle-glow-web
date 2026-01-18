"""
Resource endpoints
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.resource import Resource
from app.schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
    ResourceResponse,
    ResourceListResponse
)

router = APIRouter()


@router.get("", response_model=ResourceListResponse)
async def get_resources(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    resource_type: Optional[str] = None,
    featured: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get list of resources"""
    query = select(Resource).where(Resource.is_active == True)
    
    # Filters
    if category:
        query = query.where(Resource.category == category)
    if resource_type:
        query = query.where(Resource.resource_type == resource_type)
    if featured is not None:
        query = query.where(Resource.is_featured == featured)
    
    # Count total
    count_query = select(func.count()).select_from(Resource).where(Resource.is_active == True)
    if category:
        count_query = count_query.where(Resource.category == category)
    if resource_type:
        count_query = count_query.where(Resource.resource_type == resource_type)
    if featured is not None:
        count_query = count_query.where(Resource.is_featured == featured)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Order by featured first, then by download count
    query = query.order_by(
        Resource.is_featured.desc(),
        Resource.download_count.desc(),
        Resource.created_at.desc()
    )
    
    # Pagination
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(query)
    resources = result.scalars().all()
    
    return {
        "resources": resources,
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.get("/{resource_id}", response_model=ResourceResponse)
async def get_resource(
    resource_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a single resource"""
    result = await db.execute(
        select(Resource).where(Resource.id == resource_id, Resource.is_active == True)
    )
    resource = result.scalar_one_or_none()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    return resource


@router.post("/{resource_id}/download", status_code=status.HTTP_200_OK)
async def download_resource(
    resource_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Record a resource download"""
    result = await db.execute(
        select(Resource).where(Resource.id == resource_id, Resource.is_active == True)
    )
    resource = result.scalar_one_or_none()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    # Increment download count
    resource.download_count += 1
    await db.commit()
    
    return {
        "message": "Download recorded",
        "download_count": resource.download_count,
        "file_url": resource.file_url
    }


@router.post("", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(
    resource_data: ResourceCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new resource (admin/author only)"""
    new_resource = Resource(
        **resource_data.model_dump(),
        author_id=current_user.id
    )
    
    db.add(new_resource)
    await db.commit()
    await db.refresh(new_resource)
    
    return new_resource


@router.put("/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: str,
    resource_data: ResourceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a resource"""
    result = await db.execute(
        select(Resource).where(Resource.id == resource_id)
    )
    resource = result.scalar_one_or_none()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    # Check ownership
    if resource.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this resource"
        )
    
    # Update fields
    update_data = resource_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resource, field, value)
    
    await db.commit()
    await db.refresh(resource)
    
    return resource


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resource(
    resource_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a resource"""
    result = await db.execute(
        select(Resource).where(Resource.id == resource_id)
    )
    resource = result.scalar_one_or_none()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    
    # Check ownership
    if resource.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this resource"
        )
    
    await db.delete(resource)
    await db.commit()
    
    return None

