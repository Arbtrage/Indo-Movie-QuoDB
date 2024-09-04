from fastapi import FastAPI
from app.api import router
from app.db.elasticsearch import ElasticsearchClient
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware


def init_routers(app_: FastAPI) -> None:
    app_.include_router(router)


def create_app() -> FastAPI:
    app_ = FastAPI(
        title="IndoMovie Quo Db API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    @app_.on_event("startup")
    async def startup() -> None:
        await ElasticsearchClient.get_instance()
        await ElasticsearchClient.create_index()

    @app_.on_event("shutdown")
    async def shutdown() -> None:
        await ElasticsearchClient.get_instance().close()

    init_routers(app_=app_)
    return app_


app = create_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specific origins (or ['*'] for all origins)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Health check route
@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "ok new"}
