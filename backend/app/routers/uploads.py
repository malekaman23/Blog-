import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException

from app.models.models import User
from app.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "static", "uploads")
UPLOAD_DIR = os.path.abspath(UPLOAD_DIR)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# svg/ico added so the admin-uploaded site logo (navbar/favicon) can be
# uploaded through this same endpoint.
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}
# New: pdf support — used for the per-post "free PDF" lead-magnet attached
# to a blog post from the admin editor.
DOCUMENT_EXTENSIONS = {".pdf"}

MAX_IMAGE_SIZE = 5 * 1024 * 1024
MAX_VIDEO_SIZE = 50 * 1024 * 1024
MAX_DOCUMENT_SIZE = 20 * 1024 * 1024

# --- Optional cloud storage (Cloudinary) ---------------------------------
# Most free hosts (Render's free web service, for example) wipe the local
# filesystem on every restart/redeploy — anything saved to disk there
# eventually disappears, taking uploaded cover photos/videos/PDFs with it.
# If Cloudinary env vars are set, uploads go there instead (permanent, on
# Cloudinary's generous free tier). With nothing set, uploads keep saving
# to local disk exactly like before — local dev is unaffected either way.
CLOUDINARY_ENABLED = bool(
    os.getenv("CLOUDINARY_URL")
    or (
        os.getenv("CLOUDINARY_CLOUD_NAME")
        and os.getenv("CLOUDINARY_API_KEY")
        and os.getenv("CLOUDINARY_API_SECRET")
    )
)

if CLOUDINARY_ENABLED:
    import cloudinary
    import cloudinary.uploader

    # If CLOUDINARY_URL is set, the SDK picks it up automatically. Otherwise
    # fall back to the three separate vars.
    if not os.getenv("CLOUDINARY_URL"):
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            secure=True,
        )


def _cloudinary_resource_type(media_type: str) -> str:
    if media_type == "video":
        return "video"
    if media_type == "document":
        return "raw"
    return "image"  # covers images, svg, ico


@router.post("")
async def upload_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1].lower()

    if ext in IMAGE_EXTENSIONS:
        media_type = "image"
        max_size = MAX_IMAGE_SIZE
    elif ext in VIDEO_EXTENSIONS:
        media_type = "video"
        max_size = MAX_VIDEO_SIZE
    elif ext in DOCUMENT_EXTENSIONS:
        media_type = "document"
        max_size = MAX_DOCUMENT_SIZE
    else:
        raise HTTPException(
            status_code=400,
            detail="Only jpg, png, webp, gif, svg, ico images, mp4, webm, mov videos, or pdf files are allowed",
        )

    contents = await file.read()
    if len(contents) > max_size:
        limit_mb = max_size // (1024 * 1024)
        raise HTTPException(status_code=400, detail=f"File must be under {limit_mb}MB")

    if CLOUDINARY_ENABLED:
        try:
            result = cloudinary.uploader.upload(
                contents,
                resource_type=_cloudinary_resource_type(media_type),
                folder="compound-and-compile",
                public_id=uuid.uuid4().hex,
            )
            return {"url": result["secure_url"], "mediaType": media_type}
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Cloud upload failed: {e}")

    # Local disk fallback — identical to the original behavior, used
    # automatically whenever Cloudinary isn't configured (e.g. local dev).
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    return {"url": f"/static/uploads/{filename}", "mediaType": media_type}
