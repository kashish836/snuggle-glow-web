"""
Rate limiting utilities
"""

from datetime import datetime, timedelta
from typing import Dict, Optional
from collections import defaultdict
from fastapi import HTTPException, status

from app.core.config import settings


class RateLimiter:
    """Simple in-memory rate limiter (use Redis in production)"""
    
    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)
    
    def check_rate_limit(
        self,
        key: str,
        max_requests: int = 60,
        window_seconds: int = 60
    ):
        """
        Check if request is within rate limit
        
        Returns:
            (allowed: bool, message: Optional[str])
        """
        if not settings.RATE_LIMIT_ENABLED:
            return True, None
        
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=window_seconds)
        
        # Clean old requests
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if req_time > window_start
        ]
        
        # Check limit
        if len(self.requests[key]) >= max_requests:
            retry_after = int((self.requests[key][0] - window_start).total_seconds()) + 1
            return False, f"Rate limit exceeded. Try again in {retry_after} seconds."
        
        # Add current request
        self.requests[key].append(now)
        return True, None
    
    def reset(self, key: str):
        """Reset rate limit for a key"""
        if key in self.requests:
            del self.requests[key]


# Global rate limiter instance
rate_limiter = RateLimiter()


def check_rate_limit(
    identifier: str,
    max_requests: int = 60,
    window_seconds: int = 60
):
    """Dependency for rate limiting"""
    allowed, message = rate_limiter.check_rate_limit(identifier, max_requests, window_seconds)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=message or "Rate limit exceeded"
        )

