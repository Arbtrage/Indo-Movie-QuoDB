from celery.app import Celery
from dotenv import load_dotenv
import asyncio
from celery import group
from app.core.models.quote_model import Quote
from app.core.controllers.quote_controller import QuoteController
from app.core.services.quote import Quote_Service
from asgiref.sync import async_to_sync

load_dotenv(".env")


def make_celery():
    celery = Celery(
        __name__, backend="redis://redis:6379/0", broker="redis://redis:6379/0"
    )
    return celery


celery_app = make_celery()
celery_app.conf.update(
    task_serializer="json", result_serializer="json", accept_content=["json"]
)


@celery_app.task(name="add_bulk_quotes")
def quote_worker(data):
    print("In worker")
    try:
        service = Quote_Service()
        add_bulk_sync = async_to_sync(service.add_bulk_quotes)
        result = add_bulk_sync(data)
        return result
    except Exception as e:
        print("failed to add quotes")
        raise
