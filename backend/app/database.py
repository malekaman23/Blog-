import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Defaults to a local SQLite file so the project runs with zero extra setup.
# For PostgreSQL, set DATABASE_URL to your PostgreSQL connection string, e.g.:
# postgresql://user:password@localhost:5432/compound_and_compile
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./blog.db")

# Some hosts (Render's older Postgres URLs, Heroku-style) still hand out
# "postgres://" — SQLAlchemy 2.x only accepts "postgresql://". Normalize it
# so Postgres works out of the box wherever DATABASE_URL comes from.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
