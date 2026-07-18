import os
import google.generativeai as genai
from abc import ABC, abstractmethod

class BaseAIProvider(ABC):
    """
    Abstract Base Class for AI Model Providers to ensure future OpenAI / Claude support.
    """
    @abstractmethod
    def generate_json(self, prompt, system_instruction=None):
        """
        Generates a JSON response from the LLM.
        Returns a tuple: (response_text_string, model_name_used).
        """
        pass

class GeminiProvider(BaseAIProvider):
    """
    Concrete implementation of BaseAIProvider utilizing Google Gemini API.
    """
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")
        
        genai.configure(api_key=api_key)
        
        # Load model parameters from environment
        self.model_name = os.environ.get("AI_MODEL", "gemini-2.5-flash")
        self.temperature = float(os.environ.get("AI_TEMPERATURE", "0.6"))
        self.max_tokens = int(os.environ.get("AI_MAX_OUTPUT_TOKENS", "4096"))
        
        self.model = genai.GenerativeModel(self.model_name)

    def generate_json(self, prompt, system_instruction=None):
        # Generate with strict JSON mode configuration
        generation_config = {
            "temperature": self.temperature,
            "max_output_tokens": self.max_tokens,
            "response_mime_type": "application/json"
        }
        
        if system_instruction:
            active_model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction
            )
        else:
            active_model = self.model
            
        response = active_model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        return response.text, self.model_name
