"""
Community discussion endpoints
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_user
from app.core.rate_limiter import check_rate_limit
from app.models.user import User
from app.models.community import Discussion, DiscussionReply
from app.schemas.community import (
    DiscussionCreate,
    DiscussionUpdate,
    DiscussionResponse,
    DiscussionListResponse,
    DiscussionReplyCreate,
    DiscussionReplyResponse
)

router = APIRouter()


@router.get("", response_model=DiscussionListResponse)
async def get_discussions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get list of discussions"""
    query = select(Discussion).options(selectinload(Discussion.author))
    
    # Filter by category
    if category:
        query = query.where(Discussion.category == category)
    
    # Count total
    count_query = select(func.count()).select_from(Discussion)
    if category:
        count_query = count_query.where(Discussion.category == category)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Order by pinned first, then by last activity
    query = query.order_by(
        Discussion.is_pinned.desc(),
        Discussion.last_activity_at.desc()
    )
    
    # Pagination
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(query)
    discussions = result.scalars().all()
    
    return {
        "discussions": discussions,
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.get("/{discussion_id}", response_model=DiscussionResponse)
async def get_discussion(
    discussion_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a single discussion with replies"""
    result = await db.execute(
        select(Discussion)
        .options(selectinload(Discussion.author), selectinload(Discussion.replies).selectinload(DiscussionReply.author))
        .where(Discussion.id == discussion_id)
    )
    discussion = result.scalar_one_or_none()
    
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found"
        )
    
    # Increment view count
    discussion.view_count += 1
    await db.commit()
    await db.refresh(discussion)
    
    return discussion


@router.post("", response_model=DiscussionResponse, status_code=status.HTTP_201_CREATED)
async def create_discussion(
    discussion_data: DiscussionCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new discussion"""
    # Rate limiting
    check_rate_limit(f"discussion_create:{current_user.id}", max_requests=5, window_seconds=300)
    
    new_discussion = Discussion(
        **discussion_data.model_dump(),
        author_id=current_user.id
    )
    
    db.add(new_discussion)
    await db.commit()
    await db.refresh(new_discussion)
    
    return new_discussion


@router.put("/{discussion_id}", response_model=DiscussionResponse)
async def update_discussion(
    discussion_id: str,
    discussion_data: DiscussionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a discussion"""
    result = await db.execute(
        select(Discussion).where(Discussion.id == discussion_id)
    )
    discussion = result.scalar_one_or_none()
    
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found"
        )
    
    # Check ownership
    if discussion.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this discussion"
        )
    
    # Update fields
    update_data = discussion_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(discussion, field, value)
    
    await db.commit()
    await db.refresh(discussion)
    
    return discussion


@router.delete("/{discussion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_discussion(
    discussion_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a discussion"""
    result = await db.execute(
        select(Discussion).where(Discussion.id == discussion_id)
    )
    discussion = result.scalar_one_or_none()
    
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found"
        )
    
    # Check ownership
    if discussion.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this discussion"
        )
    
    await db.delete(discussion)
    await db.commit()
    
    return None


@router.post("/{discussion_id}/replies", response_model=DiscussionReplyResponse, status_code=status.HTTP_201_CREATED)
async def create_reply(
    discussion_id: str,
    reply_data: DiscussionReplyCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a reply to a discussion"""
    # Rate limiting
    check_rate_limit(f"reply_create:{current_user.id}", max_requests=10, window_seconds=60)
    
    # Check if discussion exists
    result = await db.execute(
        select(Discussion).where(Discussion.id == discussion_id)
    )
    discussion = result.scalar_one_or_none()
    
    if not discussion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discussion not found"
        )
    
    if discussion.is_locked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Discussion is locked"
        )
    
    # Create reply
    new_reply = DiscussionReply(
        **reply_data.model_dump(),
        discussion_id=discussion.id,
        author_id=current_user.id
    )
    
    db.add(new_reply)
    
    # Update discussion reply count and last activity
    discussion.reply_count += 1
    from datetime import datetime
    discussion.last_activity_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(new_reply)
    
    return new_reply


@router.delete("/replies/{reply_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reply(
    reply_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a reply"""
    result = await db.execute(
        select(DiscussionReply).where(DiscussionReply.id == reply_id)
    )
    reply = result.scalar_one_or_none()
    
    if not reply:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reply not found"
        )
    
    # Check ownership
    if reply.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this reply"
        )
    
    # Update discussion reply count
    discussion_result = await db.execute(
        select(Discussion).where(Discussion.id == reply.discussion_id)
    )
    discussion = discussion_result.scalar_one_or_none()
    if discussion:
        discussion.reply_count = max(0, discussion.reply_count - 1)
    
    await db.delete(reply)
    await db.commit()
    
    return None

