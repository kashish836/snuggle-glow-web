"""
Enhanced authentication endpoints
Password reset, email verification, etc.
"""

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
import secrets

from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    get_current_active_user
)
from app.core.config import settings
from app.core.rate_limiter import check_rate_limit
from app.core.email import send_verification_email, send_password_reset_email
from app.models.user import User
from app.schemas.user import UserResponse, Token

router = APIRouter()


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordReset(BaseModel):
    token: str
    new_password: str


class VerifyEmail(BaseModel):
    token: str


@router.post("/request-password-reset", status_code=status.HTTP_200_OK)
async def request_password_reset(
    request: PasswordResetRequest,
    db: AsyncSession = Depends(get_db)
):
    """Request password reset email"""
    # Rate limiting
    check_rate_limit(f"password_reset:{request.email}", max_requests=3, window_seconds=3600)
    
    # Get user
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    
    # Don't reveal if user exists (security best practice)
    if user:
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        user.password_reset_token = reset_token
        user.password_reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        await db.commit()
        
        # Send email
        base_url = settings.CORS_ORIGINS[0] if settings.CORS_ORIGINS else "http://localhost:3000"
        await send_password_reset_email(user.email, reset_token, base_url)
    
    # Always return success (don't reveal if email exists)
    return {"message": "If the email exists, a password reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    reset_data: PasswordReset,
    db: AsyncSession = Depends(get_db)
):
    """Reset password using token"""
    # Rate limiting
    check_rate_limit(f"reset_password:{reset_data.token}", max_requests=5, window_seconds=300)
    
    # Find user by token
    result = await db.execute(
        select(User).where(
            User.password_reset_token == reset_data.token,
            User.password_reset_token_expires > datetime.utcnow()
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Validate password
    if len(reset_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Update password
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.password_reset_token = None
    user.password_reset_token_expires = None
    user.failed_login_attempts = 0
    user.locked_until = None
    
    await db.commit()
    
    return {"message": "Password reset successfully"}


@router.post("/request-verification", status_code=status.HTTP_200_OK)
async def request_verification(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Request email verification"""
    if current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate verification token
    verification_token = secrets.token_urlsafe(32)
    current_user.verification_token = verification_token
    current_user.verification_token_expires = datetime.utcnow() + timedelta(days=1)
    await db.commit()
    
    # Send email
    base_url = settings.CORS_ORIGINS[0] if settings.CORS_ORIGINS else "http://localhost:3000"
    await send_verification_email(current_user.email, verification_token, base_url)
    
    return {"message": "Verification email sent"}


@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    verify_data: VerifyEmail,
    db: AsyncSession = Depends(get_db)
):
    """Verify email using token"""
    # Find user by token
    result = await db.execute(
        select(User).where(
            User.verification_token == verify_data.token,
            User.verification_token_expires > datetime.utcnow()
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # Verify user
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires = None
    await db.commit()
    
    return {"message": "Email verified successfully"}


@router.post("/resend-verification", status_code=status.HTTP_200_OK)
async def resend_verification(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Resend verification email"""
    return await request_verification(current_user, db)

