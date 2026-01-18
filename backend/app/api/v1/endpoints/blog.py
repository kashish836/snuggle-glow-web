"""
Blog post endpoints
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_user
from app.models.user import User
from app.models.blog import BlogPost
from app.schemas.blog import (
    BlogPostCreate,
    BlogPostUpdate,
    BlogPostResponse,
    BlogPostListResponse
)
import re

router = APIRouter()


def slugify(text: str) -> str:
    """Generate URL-friendly slug from text"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


@router.get("", response_model=BlogPostListResponse)
async def get_blog_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    published: Optional[bool] = True,
    db: AsyncSession = Depends(get_db)
):
    """Get list of blog posts"""
    query = select(BlogPost)
    
    # Filters
    if published is not None:
        query = query.where(BlogPost.published == published)
    if category:
        query = query.where(BlogPost.category == category)
    if featured is not None:
        query = query.where(BlogPost.featured == featured)
    
    # Count total
    count_query = select(func.count()).select_from(BlogPost)
    if published is not None:
        count_query = count_query.where(BlogPost.published == published)
    if category:
        count_query = count_query.where(BlogPost.category == category)
    if featured is not None:
        count_query = count_query.where(BlogPost.featured == featured)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Pagination
    query = query.order_by(BlogPost.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(query)
    posts = result.scalars().all()
    
    return {
        "posts": posts,
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.get("/{post_id}", response_model=BlogPostResponse)
async def get_blog_post(
    post_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a single blog post by ID"""
    result = await db.execute(
        select(BlogPost).where(BlogPost.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Increment views
    post.views += 1
    await db.commit()
    await db.refresh(post)
    
    return post


@router.post("", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    post_data: BlogPostCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new blog post"""
    # Generate slug
    base_slug = slugify(post_data.title)
    slug = base_slug
    
    # Ensure unique slug
    counter = 1
    while True:
        result = await db.execute(
            select(BlogPost).where(BlogPost.slug == slug)
        )
        if result.scalar_one_or_none() is None:
            break
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Create post
    new_post = BlogPost(
        **post_data.model_dump(),
        slug=slug,
        author_id=current_user.id,
        published_at=post_data.published and post_data.published or None
    )
    
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    
    return new_post


@router.put("/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    post_data: BlogPostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a blog post"""
    result = await db.execute(
        select(BlogPost).where(BlogPost.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Check ownership or admin (simplified - add admin check in production)
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )
    
    # Update fields
    update_data = post_data.model_dump(exclude_unset=True)
    
    # Update slug if title changed
    if "title" in update_data:
        base_slug = slugify(update_data["title"])
        slug = base_slug
        counter = 1
        while True:
            result = await db.execute(
                select(BlogPost).where(BlogPost.slug == slug, BlogPost.id != post_id)
            )
            if result.scalar_one_or_none() is None:
                break
            slug = f"{base_slug}-{counter}"
            counter += 1
        update_data["slug"] = slug
    
    # Handle published status
    if "published" in update_data and update_data["published"] and not post.published_at:
        from datetime import datetime
        update_data["published_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(post, field, value)
    
    await db.commit()
    await db.refresh(post)
    
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(
    post_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a blog post"""
    result = await db.execute(
        select(BlogPost).where(BlogPost.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Check ownership
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )
    
    await db.delete(post)
    await db.commit()
    
    return None

