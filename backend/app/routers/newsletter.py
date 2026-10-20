from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import NewsletterSubscriber, User
from app.schemas import NewsletterSubscribe, NewsletterSubscriberOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/newsletter", tags=["newsletter"])


@router.post("/subscribe", status_code=201)
def subscribe(payload: NewsletterSubscribe, db: Session = Depends(get_db)):
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == payload.email).first()
    if existing:
        # Already on the list — treat as success rather than an error so the
        # UI doesn't need to special-case "you're already subscribed".
        return {"status": "ok", "already_subscribed": True}
    sub = NewsletterSubscriber(email=payload.email)
    db.add(sub)
    db.commit()
    return {"status": "ok", "already_subscribed": False}


@router.get("/count")
def count(db: Session = Depends(get_db)):
    # Public — used to show a real subscriber count instead of a fake one.
    return {"count": db.query(NewsletterSubscriber).count()}


@router.get("/subscribers", response_model=list[NewsletterSubscriberOut])
def list_subscribers(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.created_at.desc()).all()
