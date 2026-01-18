"""
Contact form and newsletter models
"""

from sqlalchemy import Column, String, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class ContactMessage(Base):
    """Contact form submission model"""
    __tablename__ = "contact_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True)
    email = Column(String(255), nullable=False, index=True)
    topic = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    newsletter_subscribed = Column(Boolean, default=False, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)


class NewsletterSubscriber(Base):
    """Newsletter subscriber model"""
    __tablename__ = "newsletter_subscribers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    subscribed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    unsubscribed_at = Column(DateTime(timezone=True), nullable=True)

