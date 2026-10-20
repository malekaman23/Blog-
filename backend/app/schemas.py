from pydantic import BaseModel, EmailStr
from datetime import datetime


class PostOut(BaseModel):
    slug: str
    title: str
    category: str
    excerpt: str
    pullQuote: str
    content: str
    imageUrl: str | None = None
    mediaType: str = "image"
    readTime: int
    createdAt: datetime | None = None
    sourceName: str | None = None
    sourceUrl: str | None = None
    resourcePdfUrl: str | None = None

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_model(cls, post):
        return cls(
            slug=post.slug,
            title=post.title,
            category=post.category,
            excerpt=post.excerpt,
            pullQuote=post.pull_quote,
            content=post.content,
            imageUrl=post.image_url,
            mediaType=post.media_type or "image",
            readTime=post.read_time,
            createdAt=post.created_at,
            sourceName=post.source_name,
            sourceUrl=post.source_url,
            resourcePdfUrl=post.resource_pdf_url,
        )


class PostCreate(BaseModel):
    slug: str
    title: str
    category: str
    excerpt: str
    pullQuote: str
    content: str
    imageUrl: str | None = None
    mediaType: str = "image"
    readTime: int = 5
    sourceName: str | None = None
    sourceUrl: str | None = None
    resourcePdfUrl: str | None = None


class CategoryOut(BaseModel):
    slug: str
    name: str

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    slug: str
    name: str


class CommentOut(BaseModel):
    """Public shape — never includes email. Used for the comments visitors see."""
    id: int
    post_slug: str
    name: str
    content: str
    approved: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CommentAdminOut(CommentOut):
    """Admin-only shape — includes the commenter's email for moderation."""
    email: str


class CommentCreate(BaseModel):
    """What a logged-in reader submits. name/email are NOT accepted here
    anymore — they're taken from the authenticated account server-side, so a
    reader can't spoof another name or email when posting a comment."""
    post_slug: str
    content: str


class SiteSettingsOut(BaseModel):
    site_name: str
    tagline: str
    hero_heading: str
    hero_subtext: str
    about_content: str
    contact_email: str
    footer_tagline: str
    author_name: str | None = None
    author_bio: str | None = None
    logo_url: str | None = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    email: str
    name: str | None = None
    is_admin: bool

    class Config:
        from_attributes = True


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterSubscriberOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class GoogleAuthRequest(BaseModel):
    credential: str  # the ID token from Google Identity Services


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
