"""
Contains utils for connecting to the postgreSQL database
"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()


def connect_to_db():
    """
        Connects to postgresql database and returns the psycopg2 cursor object
    """
    connection = psycopg2.connect(
        database=os.getenv('DB_NAME'),
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT')
    )
    connection.autocommit = True
    cursor = connection.cursor()
    return cursor
