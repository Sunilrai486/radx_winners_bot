# * Import Python Module
import os

from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

#  Read key-value pairs from a .env file and set them as environment variables
OPENAI_APIKEY = os.getenv("OPENAI_API_KEY")