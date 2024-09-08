from app.core.services.model_service import ModelService
from app.db.elasticsearch import ElasticsearchClient
from app.core.services.translate_service import translate_service
import asyncio

class Quote_Service:
    def __init__(self):
        self.model_service = ModelService.get_instance()

    async def convert(self, quote):
        print(f"Converting quote: {quote[:50]}...")
        try:
            # Using run_in_executor to handle synchronous translate call
            loop = asyncio.get_running_loop()
            data = await loop.run_in_executor(None, translate_service.translate, quote)
            print(f"Translation successful: {data[:50]}...")
            
            # Using run_in_executor for the synchronous encode method
            encoded = await loop.run_in_executor(None, self.model_service.encode, data)
            print(f"Encoding successful, vector length: {len(encoded)}")
            return encoded
        except Exception as e:
            print(f"Error in convert method: {e}")
            raise

    async def add_bulk_quotes(self, quotes):
        print(f"In service: processing {len(quotes)} quotes")
        documents = [await self._prepare_document(quote) for quote in quotes if quote]
        documents = [doc for doc in documents if doc is not None]  # Filter out None results
        if documents:
            response = await ElasticsearchClient.trigger_quotes_bulk(documents)
            print(f"Elasticsearch bulk insert response: {response}")
            return response
        else:
            print("No documents prepared for insertion")
            return {"inserted": 0, "errors": []}

    async def _prepare_document(self, quote):
        try:
            encoded = await self.convert(quote["quote"])
            return {
                "ID": quote["quote_id"],
                "QuoteVector": encoded,
            }
        except Exception as e:
            print(f"Error processing quote {quote.get('quote_id', 'unknown')}: {e}")
            return None
