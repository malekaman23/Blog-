from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    excerpt = Column(String, nullable=False)
    pull_quote = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    media_type = Column(String, default="image")  # "image" or "video"
    read_time = Column(Integer, default=5)
    # New: optional attribution / affiliate link shown as a small box at the
    # end of the article — e.g. "Mentioned: Coursera (affiliate link)".
    source_name = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    # New: an optional PDF specific to THIS article (e.g. a cheat-sheet or
    # extended version of the post), gated behind the email-subscribe form.
    resource_pdf_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_slug = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    approved = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String, default="Compound & Compile")
    tagline = Column(String, default="Finance you can model. Tech you can rebuild.")
    hero_heading = Column(Text, default="Finance you can model.\nTech you can rebuild.")
    hero_subtext = Column(Text, default="Explainers broken down to the actual mechanics, plus the build logs from shipping the small finance and ML projects that came out of asking \"how does this really work.\"")
    about_content = Column(Text, default="Compound & Compile writes about two things that compound the same way: money, and the systems that move it. Explainers on how markets and machine learning actually work, paired with build logs from shipping real, small projects.")
    contact_email = Column(String, default="hello@compoundandcompile.in")
    footer_tagline = Column(String, default="Finance and technology, explained from first principles — plus the build logs from actually shipping the projects.")
    # New: editable from the admin Settings page, used on the About page
    author_name = Column(String, nullable=True)
    author_bio = Column(Text, nullable=True)
    # New: site logo — shown in the navbar, footer, and as the browser tab
    # favicon. Admin-uploaded from the Settings page.
    logo_url = Column(String, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Integer, default=1)
    # New: reader display name, shown on their comments. Admin users created
    # via seed_admin() won't have one set, which is fine — they never
    # comment through the reader flow.
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
