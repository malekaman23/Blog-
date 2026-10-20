import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, text

from app.database import Base, engine, SessionLocal
from app.models.models import Post, User, Category
from app.auth import hash_password
from app.routers import posts, contact, auth, settings, uploads, categories, comments, newsletter
from app.seed_content import (
    NEURAL_NETWORK,
    SIP_VS_LUMPSUM,
    ML_WEEK_1,
    BALANCE_SHEET,
    P_VALUE,
)

Base.metadata.create_all(bind=engine)


def run_light_migrations():
    """
    SQLite doesn't add new columns to an existing table automatically when a
    model changes. Rather than requiring you to delete blog.db every time a
    field is added, check for a few known columns and add them if missing.
    """
    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())

    with engine.begin() as conn:
        if "posts" in table_names:
            existing_columns = {c["name"] for c in inspector.get_columns("posts")}
            if "image_url" not in existing_columns:
                conn.execute(text("ALTER TABLE posts ADD COLUMN image_url VARCHAR"))
            if "media_type" not in existing_columns:
                conn.execute(text("ALTER TABLE posts ADD COLUMN media_type VARCHAR DEFAULT 'image'"))
            if "source_name" not in existing_columns:
                conn.execute(text("ALTER TABLE posts ADD COLUMN source_name VARCHAR"))
            if "source_url" not in existing_columns:
                conn.execute(text("ALTER TABLE posts ADD COLUMN source_url VARCHAR"))
            if "resource_pdf_url" not in existing_columns:
                conn.execute(text("ALTER TABLE posts ADD COLUMN resource_pdf_url VARCHAR"))

        if "users" in table_names:
            existing_columns = {c["name"] for c in inspector.get_columns("users")}
            if "name" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR"))

        if "site_settings" in table_names:
            existing_columns = {c["name"] for c in inspector.get_columns("site_settings")}
            if "author_name" not in existing_columns:
                conn.execute(text("ALTER TABLE site_settings ADD COLUMN author_name VARCHAR"))
            if "author_bio" not in existing_columns:
                conn.execute(text("ALTER TABLE site_settings ADD COLUMN author_bio TEXT"))
            if "logo_url" not in existing_columns:
                conn.execute(text("ALTER TABLE site_settings ADD COLUMN logo_url VARCHAR"))


run_light_migrations()

app = FastAPI(title="Compound & Compile API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static")
os.makedirs(os.path.join(STATIC_DIR, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(contact.router)
app.include_router(settings.router)
app.include_router(uploads.router)
app.include_router(categories.router)
app.include_router(comments.router)
app.include_router(newsletter.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "Compound & Compile API"}


ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@compoundandcompile.in")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "changeme123")


def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if existing:
            return
        admin = User(
            email=ADMIN_EMAIL,
            hashed_password=hash_password(ADMIN_PASSWORD),
            is_admin=1,
        )
        db.add(admin)
        db.commit()
    finally:
        db.close()


def seed_posts():
    db = SessionLocal()
    try:
        if db.query(Post).count() > 0:
            return
        starter = [
            Post(
                slug="inside-a-neural-network",
                title="Inside a Neural Network: What Actually Happens When You Hit Enter",
                category="machine-learning",
                excerpt="Tracing one prompt through tokens, weights and a softmax layer — with the matrix math laid out, not hand-waved.",
                pull_quote="The model never sees your words. From the first layer onward, everything is a vector of numbers.",
                content=NEURAL_NETWORK,
                read_time=10,
            ),
            Post(
                slug="sip-vs-lump-sum-data",
                title="The SIP vs Lump Sum Debate, Settled With Data",
                category="personal-finance",
                excerpt="Fifteen years of Nifty 500 rolling returns, run through both strategies, to see which actually wins and by how much.",
                pull_quote="You're not trying to predict the market. You're trying to outlast it.",
                content=SIP_VS_LUMPSUM,
                read_time=8,
            ),
            Post(
                slug="first-ml-model-week-1",
                title="Building My First ML Model: Week 1 of Actually Shipping Something",
                category="build-logs",
                excerpt="A diary-style log of cleaning a messy dataset, picking a model that wasn't overkill, and the three bugs that ate a whole evening.",
                pull_quote="The bug wasn't in the model. It was in a column I never looked at twice.",
                content=ML_WEEK_1,
                read_time=9,
            ),
            Post(
                slug="reading-a-balance-sheet",
                title="Reading a Company's Balance Sheet in Four Numbers",
                category="market-analysis",
                excerpt="Skip the 40-page annual report — current ratio, debt-to-equity, ROE and free cash flow tell you most of what matters.",
                pull_quote="Four ratios tell you more than forty pages of management commentary.",
                content=BALANCE_SHEET,
                read_time=8,
            ),
            Post(
                slug="what-a-p-value-tells-you",
                title="What a p-value Actually Tells You (And What It Doesn't)",
                category="data-science",
                excerpt="The most misquoted number in data science, explained with a coin-flip experiment you can run yourself in five minutes.",
                pull_quote="A p-value tells you about your data assuming the null hypothesis. It never tells you the hypothesis is true.",
                content=P_VALUE,
                read_time=8,
            ),
        ]
        db.add_all(starter)
        db.commit()
    finally:
        db.close()


def seed_categories():
    db = SessionLocal()
    try:
        if db.query(Category).count() > 0:
            return
        db.add_all([
            Category(slug="personal-finance", name="Personal Finance"),
            Category(slug="machine-learning", name="Machine Learning"),
            Category(slug="market-analysis", name="Market Analysis"),
            Category(slug="build-logs", name="Build Logs"),
            Category(slug="data-science", name="Data Science"),
        ])
        db.commit()
    finally:
        db.close()


seed_admin()
seed_posts()
seed_categories()
