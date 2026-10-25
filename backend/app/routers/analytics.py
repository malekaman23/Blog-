import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone, time
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, Header, Response
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth import SECRET_KEY, ALGORITHM, get_current_admin
from app.database import get_db
from app.models.analytics import PageView
from app.models.models import Post, User, Comment, NewsletterSubscriber

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

IST = timezone(timedelta(hours=5, minutes=30))
BOT_RE = re.compile(
    r"bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|"
    r"curl|wget|python-requests|monitor|uptime|cron",
    re.I,
)
VISITOR_RE = re.compile(r"^[A-Za-z0-9\-]{8,64}$")


class TrackIn(BaseModel):
    path: str
    visitor_id: str
    referrer: str | None = None


def _optional_user(db: Session, authorization: str | None):
    """Signed-in reader if a valid token came along, else None. Never raises —
    tracking must not fail just because a token expired."""
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    try:
        payload = jwt.decode(authorization[7:], SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        return None
    if not email:
        return None
    return db.query(User).filter(User.email == email).first()


@router.post("/track", status_code=204)
def track(
    payload: TrackIn,
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
    user_agent: str | None = Header(default=None),
):
    ua = user_agent or ""
    path = (payload.path or "")[:300]
    if (
        BOT_RE.search(ua)
        or not path.startswith("/")
        or path.startswith("/admin")
        or not VISITOR_RE.match(payload.visitor_id or "")
    ):
        return Response(status_code=204)

    user = _optional_user(db, authorization)
    if user and user.is_admin:
        return Response(status_code=204)  # don't count your own browsing

    slug_match = re.match(r"^/blog/([^/?#]+)", path)
    ref_host = None
    if payload.referrer:
        try:
            ref_host = urlparse(payload.referrer).netloc[:100] or None
        except ValueError:
            ref_host = None

    db.add(
        PageView(
            path=path,
            post_slug=slug_match.group(1) if slug_match else None,
            visitor_id=payload.visitor_id,
            user_id=user.id if user else None,
            referrer=ref_host,
            device="mobile" if re.search(r"Mobi|Android|iPhone", ua) else "desktop",
        )
    )
    db.commit()
    return Response(status_code=204)


def _ist(dt):
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(IST)


def _utc_naive(d):
    """Start of an IST calendar day, as a naive UTC datetime for DB filters."""
    return datetime.combine(d, time.min, tzinfo=IST).astimezone(timezone.utc).replace(tzinfo=None)


@router.get("/summary")
def summary(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    today = datetime.now(IST).date()
    d7 = today - timedelta(days=6)
    d30 = today - timedelta(days=29)
    d90 = today - timedelta(days=89)

    rows = (
        db.query(
            PageView.created_at, PageView.visitor_id, PageView.user_id,
            PageView.post_slug, PageView.path, PageView.referrer, PageView.device,
        )
        .filter(PageView.created_at >= _utc_naive(d90))
        .limit(300000)
        .all()
    )

    views_day = Counter()
    visitors_day = defaultdict(set)
    vis = {"today": set(), "d7": set(), "d30": set()}
    views = {"today": 0, "d7": 0, "d30": 0}
    visitor_days = defaultdict(set)
    logged_in_30 = set()
    post_views, post_visitors = Counter(), defaultdict(set)
    pages, refs, devices = Counter(), Counter(), Counter()
    user_stats = {}

    for created, vid, uid, slug, path, ref, device in rows:
        d = _ist(created).date()
        if uid is not None:
            s = user_stats.setdefault(uid, {"views": 0, "last": None, "slugs": set()})
            s["views"] += 1
            if s["last"] is None or created > s["last"]:
                s["last"] = created
            if slug:
                s["slugs"].add(slug)
        if d < d30:
            continue
        views_day[d] += 1
        visitors_day[d].add(vid)
        visitor_days[vid].add(d)
        views["d30"] += 1
        vis["d30"].add(vid)
        if uid is not None:
            logged_in_30.add(uid)
        if d >= d7:
            views["d7"] += 1
            vis["d7"].add(vid)
        if d == today:
            views["today"] += 1
            vis["today"].add(vid)
        if slug:
            post_views[slug] += 1
            post_visitors[slug].add(vid)
        pages[path] += 1
        refs[ref or "Direct"] += 1
        devices[device or "desktop"] += 1

    # Users / subscribers / comments
    users_q = db.query(User).filter(User.is_admin == 0)
    users_total = users_q.count()
    users_7 = users_q.filter(User.created_at >= _utc_naive(d7)).count()
    users_30 = users_q.filter(User.created_at >= _utc_naive(d30)).count()
    subs_total = db.query(NewsletterSubscriber).count()
    subs_q = db.query(NewsletterSubscriber)
    subs_7 = subs_q.filter(NewsletterSubscriber.created_at >= _utc_naive(d7)).count()
    subs_30 = subs_q.filter(NewsletterSubscriber.created_at >= _utc_naive(d30)).count()

    signup_day, sub_day = Counter(), Counter()
    for (c,) in db.query(User.created_at).filter(User.is_admin == 0, User.created_at >= _utc_naive(d30)):
        signup_day[_ist(c).date()] += 1
    for (c,) in db.query(NewsletterSubscriber.created_at).filter(NewsletterSubscriber.created_at >= _utc_naive(d30)):
        sub_day[_ist(c).date()] += 1

    series = []
    for i in range(30):
        d = d30 + timedelta(days=i)
        series.append({
            "date": d.isoformat(),
            "views": views_day[d],
            "visitors": len(visitors_day[d]),
            "signups": signup_day[d],
            "subscribers": sub_day[d],
        })

    titles = {}
    if post_views:
        for slug, title in db.query(Post.slug, Post.title).filter(Post.slug.in_(list(post_views))):
            titles[slug] = title
    top_posts = [
        {"slug": s, "title": titles.get(s, s), "views": v, "visitors": len(post_visitors[s])}
        for s, v in post_views.most_common(10)
    ]

    comment_counts = dict(
        db.query(Comment.email, func.count(Comment.id)).group_by(Comment.email).all()
    )
    recent_users = []
    for u in users_q.order_by(User.created_at.desc()).limit(50).all():
        st = user_stats.get(u.id)
        recent_users.append({
            "email": u.email,
            "name": u.name,
            "joined": u.created_at.isoformat() if u.created_at else None,
            "views": st["views"] if st else 0,
            "articles_read": len(st["slugs"]) if st else 0,
            "last_seen": st["last"].isoformat() if st and st["last"] else None,
            "comments": comment_counts.get(u.email, 0),
        })

    recent_subs = [
        {"email": s.email, "joined": s.created_at.isoformat() if s.created_at else None}
        for s in subs_q.order_by(NewsletterSubscriber.created_at.desc()).limit(20).all()
    ]

    returning = sum(1 for days_seen in visitor_days.values() if len(days_seen) >= 2)
    v30 = len(vis["d30"])

    return {
        "users": {"total": users_total, "new_7d": users_7, "new_30d": users_30,
                  "active_logged_in_30d": len(logged_in_30)},
        "subscribers": {"total": subs_total, "new_7d": subs_7, "new_30d": subs_30,
                        "conversion_rate_30d": round(subs_30 / v30 * 100, 1) if v30 else 0},
        "comments": {"total": db.query(Comment).count(),
                     "pending": db.query(Comment).filter(Comment.approved == 0).count()},
        "posts_total": db.query(Post).count(),
        "traffic": {
            "views_today": views["today"], "views_7d": views["d7"], "views_30d": views["d30"],
            "visitors_today": len(vis["today"]), "visitors_7d": len(vis["d7"]), "visitors_30d": v30,
            "returning_visitors_30d": returning,
        },
        "series": series,
        "top_posts": top_posts,
        "top_pages": [{"path": p, "views": v} for p, v in pages.most_common(10)],
        "referrers": [{"source": r, "views": v} for r, v in refs.most_common(10)],
        "devices": dict(devices),
        "recent_users": recent_users,
        "recent_subscribers": recent_subs,
    }
