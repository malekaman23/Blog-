from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import ContactMessage
from app.schemas import ContactCreate, ContactOut

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactOut, status_code=201)
def submit_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(name=payload.name, email=payload.email, message=payload.message)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
