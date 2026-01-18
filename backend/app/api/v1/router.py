"""
Main API router
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, blog, community, contact, resources
from app.api.v1.endpoints import auth_enhanced

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(auth_enhanced.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])
api_router.include_router(community.router, prefix="/community", tags=["Community"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])

