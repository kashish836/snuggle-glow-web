"""
Email utilities for sending emails
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from typing import Optional


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> bool:
    """
    Send an email
    
    Returns True if successful, False otherwise
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        # In development, just log instead of sending
        print(f"[EMAIL] Would send to {to_email}: {subject}")
        print(f"[EMAIL] Content: {html_content[:200]}...")
        return True
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = settings.SMTP_FROM_EMAIL
        msg['To'] = to_email
        
        # Add both plain text and HTML versions
        if text_content:
            part1 = MIMEText(text_content, 'plain')
            msg.attach(part1)
        
        part2 = MIMEText(html_content, 'html')
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


async def send_verification_email(email: str, verification_token: str, base_url: str = "http://localhost:3000"):
    """Send email verification link"""
    verification_link = f"{base_url}/verify-email.html?token={verification_token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #ec4899; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
            .button:hover {{ background-color: #db2777; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 style="color: #ec4899;">Welcome to SnuggleNest! 👶</h1>
            <p>Thank you for joining our community of amazing mamas!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="{verification_link}" class="button">Verify Email Address</a>
            <p>Or copy this link to your browser:</p>
            <p style="word-break: break-all; color: #666;">{verification_link}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <p>With love,<br>The SnuggleNest Team 💕</p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to SnuggleNest!
    
    Please verify your email address by visiting:
    {verification_link}
    
    This link will expire in 24 hours.
    """
    
    return await send_email(email, "Verify Your SnuggleNest Account", html_content, text_content)


async def send_password_reset_email(email: str, reset_token: str, base_url: str = "http://localhost:3000"):
    """Send password reset link"""
    reset_link = f"{base_url}/reset-password.html?token={reset_token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #ec4899; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
            .button:hover {{ background-color: #db2777; }}
            .warning {{ color: #dc2626; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 style="color: #ec4899;">Password Reset Request</h1>
            <p>We received a request to reset your password for your SnuggleNest account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{reset_link}" class="button">Reset Password</a>
            <p>Or copy this link to your browser:</p>
            <p style="word-break: break-all; color: #666;">{reset_link}</p>
            <p class="warning">This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>With love,<br>The SnuggleNest Team 💕</p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Password Reset Request
    
    Click this link to reset your password:
    {reset_link}
    
    This link expires in 1 hour.
    If you didn't request this, please ignore this email.
    """
    
    return await send_email(email, "Reset Your SnuggleNest Password", html_content, text_content)

