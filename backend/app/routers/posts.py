from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Post, User
from app.schemas import PostOut, PostCreate
from app.auth import get_current_user

router = APIRouter(prefix="/api/posts", tags=["posts"])


@router.get("", response_model=list[PostOut])
def list_posts(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Post).order_by(Post.created_at.desc())
    if category:
        query = query.filter(Post.category == category)
    posts = query.all()
    return [PostOut.from_orm_model(p) for p in posts]


@router.get("/{slug}", response_model=PostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostOut.from_orm_model(post)


@router.post("", response_model=PostOut, status_code=201)
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Post).filter(Post.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    post = Post(
        slug=payload.slug,
        title=payload.title,
        category=payload.category,
        excerpt=payload.excerpt,
        pull_quote=payload.pullQuote,
        content=payload.content,
        image_url=payload.imageUrl,
        media_type=payload.mediaType,
        read_time=payload.readTime,
        source_name=payload.sourceName,
        source_url=payload.sourceUrl,
        resource_pdf_url=payload.resourcePdfUrl,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return PostOut.from_orm_model(post)


@router.put("/{slug}", response_model=PostOut)
def update_post(
    slug: str,
    payload: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.title = payload.title
    post.category = payload.category
    post.excerpt = payload.excerpt
    post.pull_quote = payload.pullQuote
    post.content = payload.content
    post.image_url = payload.imageUrl
    post.media_type = payload.mediaType
    post.read_time = payload.readTime
    post.source_name = payload.sourceName
    post.source_url = payload.sourceUrl
    post.resource_pdf_url = payload.resourcePdfUrl
    db.commit()
    db.refresh(post)
    return PostOut.from_orm_model(post)


@router.delete("/{slug}", status_code=204)
def delete_post(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
