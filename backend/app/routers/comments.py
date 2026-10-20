from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Comment, User
from app.schemas import CommentOut, CommentAdminOut, CommentCreate
from app.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/comments", tags=["comments"])


@router.get("", response_model=list[CommentOut])
def list_approved_comments(post_slug: str, db: Session = Depends(get_db)):
    # Public endpoint — CommentOut never includes email, so no reader's
    # email is ever exposed to site visitors here.
    return (
        db.query(Comment)
        .filter(Comment.post_slug == post_slug, Comment.approved == 1)
        .order_by(Comment.created_at.asc())
        .all()
    )


@router.post("", response_model=CommentOut, status_code=201)
def submit_comment(
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Commenting now requires being logged in. name/email come from the
    # authenticated account, never from the request body — a reader can no
    # longer post under a fake name or someone else's email.
    comment = Comment(
        post_slug=payload.post_slug,
        name=current_user.name or current_user.email.split("@")[0],
        email=current_user.email,
        content=payload.content,
        approved=0,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.get("/all", response_model=list[CommentAdminOut])
def list_all_comments(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    # Admin-only. CommentAdminOut includes email so you can moderate /
    # follow up on commenters.
    return db.query(Comment).order_by(Comment.created_at.desc()).all()


@router.put("/{comment_id}/approve", response_model=CommentAdminOut)
def approve_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.approved = 1
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/{comment_id}", status_code=204)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
