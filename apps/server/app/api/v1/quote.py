from fastapi import APIRouter, HTTPException, Body, Query, status
from celery.result import AsyncResult
from app.core.workers.celery_worker import quote_worker, celery_app
from app.core.models.quote_model import Quote
from typing import List
from app.core.controllers.quote_controller import QuoteController

quote_router = APIRouter()
quote_controller = QuoteController()


@quote_router.get("/search", tags=["Quote"])
async def get_quote(query: str = Query(..., description="Search query for quotes")):
    try:
        query = await quote_controller.get_quote(query)
    except Exception as e:
        print(e)
    return query


@quote_router.get("/all-quotes", tags=["Quote"])
async def quotes():
    try:
        quotes = await quote_controller.quotes()
        if not quotes:
            print("No quotes found.")
            raise ValueError("No quotes found")
        return quotes
    except Exception as e:
        print(e)
    return quotes


@quote_router.post("/add-quote", status_code=status.HTTP_201_CREATED)
async def add_quote(quote: Quote = Body(...)):
    try:
        quote = await quote_controller.add_quote(quote)
    except Exception as e:
        print(e)
    return quote


@quote_router.post("/add-quotes-bulk")
async def add_quotes_bulk(quotes: List[Quote] = Body(...)):
    try:
        response = await quote_controller.add_quotes_bulk(quotes)
        return response
    except Exception as e:
        print(e)
        return {"error": str(e)}


@quote_router.post("/trigger-quotes-bulk")
async def trigger_quotes_bulk(quotes: List[Quote] = Body(...)):
    try:
        quotes_data = [quote.dict() for quote in quotes]
        print("Starting task...")
        response = quote_worker.delay(quotes_data)
        return {"task_id": response.id}
    except Exception as e:
        print(e)
        return {"error": str(e)}


@quote_router.get("/get-status/{id}")
async def get_status(id: str):
    try:
        task_result = AsyncResult(id, app=celery_app)
        if not task_result.ready():
            return {"status": "Running"}
        if task_result.failed():
            raise Exception("Report generation failed.")
        return {"status": "Complete", "data": task_result.get()}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            status="Error",
            detail=f"Failed to retrieve report: {str(e)}",
        )
