from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api import (
    auth,
    explanation,
    health,
    prediction,
    prevention,
    simulation,
    tracking,
    users,
)
from app.models.user import User
from app.models.user_settings import UserSettings
from app.core.config import settings
from app.frontend import (
    ASSETS_DIR,
    INDEX_FILE,
    frontend_ready,
    is_reserved_frontend_path,
    missing_frontend_response,
    safe_dist_file,
)

app = FastAPI(
    title="VitalAI Backend",
    description=(
        "API for the VitalAI health digital twin prototype. "
        "Risk values are estimated and illustrative. "
        "This service does not provide medical advice or diagnoses."
    ),
    version="0.2.0",
)

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# HTTP EXCEPTION HANDLER
# ---------------------------------------------------------

@app.exception_handler(HTTPException)
async def http_exception_handler(
    _request: Request,
    exc: HTTPException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# ---------------------------------------------------------
# VALIDATION ERROR HANDLER
# ---------------------------------------------------------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    health_paths = (
        "/api/health/profile",
        "/api/predict",
        "/api/simulate",
        "/api/tracking",
    )

    detail = (
        "Invalid health data"
        if any(request.url.path.startswith(path) for path in health_paths)
        else "Invalid request"
    )

    print("\n========== VALIDATION ERROR ==========")
    print("Path:", request.url.path)
    print("Errors:", exc.errors())
    print("======================================\n")

    return JSONResponse(
        status_code=400,
        content={
            "detail": detail,
            "errors": exc.errors(),
        },
    )


# ---------------------------------------------------------
# GLOBAL ERROR HANDLER
# ---------------------------------------------------------
# IMPORTANT:
# This temporarily exposes the actual backend error so we
# can identify why Login/Register is returning HTTP 500.
# ---------------------------------------------------------

@app.exception_handler(Exception)
async def unhandled_exception_handler(
    _request: Request,
    exc: Exception,
):
    import traceback

    print("\n")
    print("==============================================")
    print("🔥 VITALAI BACKEND UNHANDLED ERROR")
    print("==============================================")
    print("ERROR TYPE:", type(exc).__name__)
    print("ERROR:", str(exc))
    print("------------- TRACEBACK ----------------------")
    traceback.print_exc()
    print("==============================================")
    print("\n")

    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc) or "An unexpected error occurred",
            "error_type": type(exc).__name__,
        },
    )


# ---------------------------------------------------------
# SYSTEM HEALTH CHECK
# ---------------------------------------------------------

@app.get(
    "/api/health",
    tags=["System"],
    summary="Service health check",
)
def health_check():
    return {
        "status": "healthy",
        "service": "VitalAI Backend",
    }


# ---------------------------------------------------------
# API ROUTERS
# ---------------------------------------------------------

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(health.router)
app.include_router(prediction.router)
app.include_router(explanation.router)
app.include_router(simulation.router)
app.include_router(prevention.router)
app.include_router(tracking.router)


# ---------------------------------------------------------
# FRONTEND STATIC ASSETS
# ---------------------------------------------------------

if ASSETS_DIR.is_dir():
    app.mount(
        "/assets",
        StaticFiles(directory=ASSETS_DIR),
        name="assets",
    )


# ---------------------------------------------------------
# FRONTEND SPA FALLBACK
# ---------------------------------------------------------

@app.get(
    "/{full_path:path}",
    include_in_schema=False,
)
async def spa_fallback(full_path: str):

    # Do not allow frontend fallback to swallow API routes
    if is_reserved_frontend_path(full_path):
        return JSONResponse(
            status_code=404,
            content={"detail": "Not found"},
        )

    # Frontend build is not available
    if not frontend_ready():
        return missing_frontend_response()

    # Serve existing files from dist
    existing = safe_dist_file(full_path)

    if existing is not None:
        return FileResponse(existing)

    # Otherwise serve index.html for React Router
    return FileResponse(INDEX_FILE)