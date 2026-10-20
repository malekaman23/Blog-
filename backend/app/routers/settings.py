from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import SiteSettings, User
from app.schemas import SiteSettingsOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/settings", tags=["settings"])


def get_or_create_settings(db: Session) -> SiteSettings:
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("", response_model=SiteSettingsOut)
def get_settings(db: Session = Depends(get_db)):
    return get_or_create_settings(db)


@router.put("", response_model=SiteSettingsOut)
def update_settings(
    payload: SiteSettingsOut,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    settings = get_or_create_settings(db)
    for field, value in payload.dict().items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings
