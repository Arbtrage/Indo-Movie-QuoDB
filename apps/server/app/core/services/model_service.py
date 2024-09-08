from sentence_transformers import SentenceTransformer


class ModelService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            try:
                print("Initializing SentenceTransformer model...")
                cls._instance = SentenceTransformer('all-mpnet-base-v2')
                print("Model initialized successfully")
            except Exception as e:
                print("Failed to initialize model: %s", e)
                raise
        return cls._instance

    def encode(self, text):
        try:
            print(f"Encoding text: {text[:50]}...")  # Log first 50 characters
            return self._instance.encode(text).tolist()
        except Exception as e:
            print("Error encoding text: %s", e)
            raise

model_service = ModelService.get_instance()
