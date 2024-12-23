import re
from config import (
    MONGODB_DATABASE,
    MONGODB_HOST
)
from pymongo import MongoClient

def get_db() -> MongoClient:
    client = MongoClient(MONGODB_HOST)
    return client[MONGODB_DATABASE]

def is_password_valid(password):
    # check if password is at least 8 characters long
    if len(password) < 8:
        return False
    # check if password contains both letters and numbers
    if not re.search(r"[A-Za-z]", password) or not re.search(r"[0-9]", password):
        return False
    return True
