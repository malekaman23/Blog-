from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.sql import func
from app.database import Base


class PageView(Base):
    """One row per page a visitor opens. First-party and cookie-free: the
    visitor is an anonymous random id the browser makes up, no IP address is
    stored. user_id is only filled when a signed-in reader is browsing."""

    __tablename__ = "page_views"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, nullable=False)
    post_slug = Column(String, nullable=True, index=True)
    visitor_id = Column(String, nullable=False, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    referrer = Column(String, nullable=True)  # host only, e.g. "google.com"
    device = Column(String, nullable=True)  # "mobile" / "desktop"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
