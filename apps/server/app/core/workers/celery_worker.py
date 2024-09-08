from celery import Celery
from dotenv import load_dotenv
import asyncio
import logging
from app.core.services.quote import Quote_Service

logger = logging.getLogger(__name__)

load_dotenv(".env")

def make_celery():
    """Create and configure the Celery app."""
    celery = Celery(__name__, backend="redis://redis:6379/0", broker="redis://redis:6379/0")
    celery.conf.update(
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],
        task_time_limit=600,
        task_soft_time_limit=590,
        worker_max_tasks_per_child=50,
        worker_concurrency=4,
        task_acks_late=True,
        task_reject_on_worker_lost=True,
    )
    return celery

celery_app = make_celery()

@celery_app.task(name="add_bulk_quotes")
def quote_worker(data):
    logger.info(f"Starting worker task with {len(data)} quotes")
    
    service = Quote_Service()
    
    # Using asyncio.run() to create and manage the event loop correctly
    try:
        result = asyncio.run(service.add_bulk_quotes(data))
        print("Task completed successfully")
    except Exception as e:
        print(f"An error occurred: {e}")
        result = {"success": False, "error": str(e)}
    
    return result
