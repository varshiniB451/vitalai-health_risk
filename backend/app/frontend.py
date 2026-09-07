from pathlib import Path

from fastapi.responses import FileResponse, JSONResponse


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DIST_DIR = PROJECT_ROOT / "dist"
INDEX_FILE = DIST_DIR / "index.html"
ASSETS_DIR = DIST_DIR / "assets"
MISSING_FRONTEND = "Frontend build not found. Run npm run build."

RESERVED_PREFIXES = ("api", "docs", "redoc")
RESERVED_PATHS = {"openapi.json"}


def frontend_ready() -> bool:
    return INDEX_FILE.is_file()


def missing_frontend_response():
    return JSONResponse(status_code=503, content={"detail": MISSING_FRONTEND})


def is_reserved_frontend_path(full_path: str) -> bool:
    cleaned = full_path.strip("/")
    if not cleaned:
        return False
    first = cleaned.split("/", 1)[0]
    return first in RESERVED_PREFIXES or cleaned in RESERVED_PATHS


def safe_dist_file(full_path: str) -> Path | None:
    if not full_path or not frontend_ready():
        return None
    candidate = (DIST_DIR / full_path).resolve()
    try:
        candidate.relative_to(DIST_DIR.resolve())
    except ValueError:
        return None
    if candidate.is_file():
        return candidate
    return None
