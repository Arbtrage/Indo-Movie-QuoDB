from app.core.services.model_service import model_service
from app.core.models.quote_model import Quote
from app.db.elasticsearch import ElasticsearchClient
from app.core.controllers.quote_controller import QuoteController

class Quote_Service:
    def __init__(self):
        pass
        
    def add_bulk_quotes(self,data):
        controller=QuoteController()
        response = controller.trigger_quotes_bulk(data)
        return response