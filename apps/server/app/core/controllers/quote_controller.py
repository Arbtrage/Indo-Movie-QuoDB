from app.core.services.model_service import model_service
from app.core.models.quote_model import Quote
from app.db.elasticsearch import ElasticsearchClient
from app.core.services.translate_service import translate_service
import logging

logger = logging.getLogger(__name__)

class QuoteController:
    def __init__(self):
        pass

    def convert(self, quote):
        data = translate_service.translate(quote)
        return model_service.encode(data)

    async def get_quote(self, query: str):
        queryVector = self.convert(query)
        response = await ElasticsearchClient.get_quote(queryVector)
        return response

    async def quotes(self):
        response = await ElasticsearchClient.get_quotes()
        return response

    async def add_quote(self, quote: Quote):
        quoteVector = self.convert(quote.quote)
        document = {
            "ID": quote.quote_id,
            "QuoteVector": quoteVector,
        }
        response = await ElasticsearchClient.insert_quote(document)
        return response

    async def add_quotes_bulk(self, quotes):
        documents = [
            {
                "ID": quote.quote_id,
                "QuoteVector": self.convert(quote.quote),
            }
            for quote in quotes
        ]

        response = await ElasticsearchClient.insert_quotes_bulk(documents)
        return response

    async def trigger_quotes_bulk(self, quotes):
        print(f"In controller: processing {len(quotes)} quotes")
        documents = [
            {
                "ID": quote["quote_id"],
                "QuoteVector": self.convert(quote["quote"]),
            }
            for quote in quotes
        ]
        print(f"Prepared {len(documents)} documents for Elasticsearch")
        response = await ElasticsearchClient.insert_quotes_bulk(documents)
        print(f"Elasticsearch bulk insert response: {response}")
        return response
