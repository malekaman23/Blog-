import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User
from app.schemas import LoginRequest, SignupRequest, TokenOut, UserOut, GoogleAuthRequest
from app.auth import verify_password, hash_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")


@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token({"sub": user.email})
    return TokenOut(access_token=token)


@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """Reader signup — NOT the admin account. Creates a regular (is_admin=0)
    user so they can comment on articles. Reading the blog itself never
    requires this; it's only needed to leave a comment."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        name=payload.name,
        is_admin=0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.email})
    return TokenOut(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut(email=current_user.email, name=current_user.name, is_admin=bool(current_user.is_admin))


@router.post("/google", response_model=TokenOut)
def google_login(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Reader sign-in via "Continue with Google". Verifies the ID token
    Google's own JS gave the browser, then finds or creates a regular
    (is_admin=0) account for that email and returns our own JWT — same
    token shape as normal login/signup, so the rest of the app doesn't need
    to know whether someone signed up with a password or with Google.

    Inert until GOOGLE_CLIENT_ID is set in the backend's environment — set
    it to the OAuth Client ID from Google Cloud Console (same value used as
    NEXT_PUBLIC_GOOGLE_CLIENT_ID on the frontend).
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google sign-in isn't configured yet (GOOGLE_CLIENT_ID is not set on the backend).",
        )

    try:
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests as google_requests
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google sign-in needs the 'google-auth' package — run: pip install google-auth",
        )

    try:
        idinfo = google_id_token.verify_oauth2_token(
            payload.credential, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    email = idinfo.get("email")
    if not email or not idinfo.get("email_verified", False):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google account email not verified")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            # Google-signed-in accounts don't have a usable password here —
            # this hash can never be produced by a real password, so a
            # normal email/password login for this account will always fail,
            # which is what we want (Google is the only way in for it).
            hashed_password=hash_password(os.urandom(24).hex()),
            name=idinfo.get("name") or email.split("@")[0],
            is_admin=0,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": user.email})
    return TokenOut(access_token=token)
