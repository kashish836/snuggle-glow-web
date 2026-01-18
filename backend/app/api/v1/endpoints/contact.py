"""
Contact form and newsletter endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.rate_limiter import check_rate_limit
from app.models.contact import ContactMessage, NewsletterSubscriber
from app.schemas.contact import (
    ContactMessageCreate,
    ContactMessageResponse,
    NewsletterSubscribe,
    NewsletterSubscriberResponse
)

router = APIRouter()


@router.post("/message", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_message(
    message_data: ContactMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    """Submit a contact form message"""
    # Rate limiting by IP (in production, use request.client.host)
    check_rate_limit(f"contact:{message_data.email}", max_requests=3, window_seconds=3600)
    
    # Create contact message
    new_message = ContactMessage(
        first_name=message_data.first_name,
        last_name=message_data.last_name,
        email=message_data.email,
        topic=message_data.topic,
        message=message_data.message,
        newsletter_subscribed=message_data.newsletter
    )
    
    db.add(new_message)
    
    # If newsletter is checked, subscribe them
    if message_data.newsletter:
        result = await db.execute(
            select(NewsletterSubscriber).where(NewsletterSubscriber.email == message_data.email)
        )
        existing = result.scalar_one_or_none()
        
        if not existing:
            subscriber = NewsletterSubscriber(email=message_data.email)
            db.add(subscriber)
        elif not existing.is_active:
            existing.is_active = True
            existing.unsubscribed_at = None
    
    await db.commit()
    await db.refresh(new_message)
    
    # In production, send email notification here
    # await send_email_notification(new_message)
    
    return new_message


@router.post("/newsletter/subscribe", response_model=NewsletterSubscriberResponse, status_code=status.HTTP_201_CREATED)
async def subscribe_newsletter(
    subscriber_data: NewsletterSubscribe,
    db: AsyncSession = Depends(get_db)
):
    """Subscribe to newsletter"""
    # Rate limiting
    check_rate_limit(f"newsletter:{subscriber_data.email}", max_requests=3, window_seconds=3600)
    
    # Check if already subscribed
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == subscriber_data.email)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already subscribed"
            )
        else:
            # Reactivate subscription
            existing.is_active = True
            existing.unsubscribed_at = None
            await db.commit()
            await db.refresh(existing)
            return existing
    
    # Create new subscription
    new_subscriber = NewsletterSubscriber(email=subscriber_data.email)
    db.add(new_subscriber)
    await db.commit()
    await db.refresh(new_subscriber)
    
    # In production, send welcome email here
    # await send_welcome_email(new_subscriber.email)
    
    return new_subscriber


@router.post("/newsletter/unsubscribe", status_code=status.HTTP_200_OK)
async def unsubscribe_newsletter(
    subscriber_data: NewsletterSubscribe,
    db: AsyncSession = Depends(get_db)
):
    """Unsubscribe from newsletter"""
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == subscriber_data.email)
    )
    subscriber = result.scalar_one_or_none()
    
    if not subscriber or not subscriber.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found in subscribers list"
        )
    
    # Unsubscribe
    from datetime import datetime
    subscriber.is_active = False
    subscriber.unsubscribed_at = datetime.utcnow()
    
    await db.commit()
    
    return {"message": "Successfully unsubscribed"}

