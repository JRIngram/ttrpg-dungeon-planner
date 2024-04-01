import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def connect_to_db():
    connection = psycopg2.connect(
        database=os.getenv('DB_NAME'),
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT')
    )
    cursor = connection.cursor()
    return cursor

def select_all_dungeons():
    cursor = connect_to_db()
    cursor.execute("SELECT * FROM dungeon")
    dungeons = cursor.fetchall()
    cursor.close()
    return dungeons

def select_dungeon_by_id(dungeon_id: str):
    cursor = connect_to_db()
    cursor.execute("SELECT * FROM dungeon WHERE id = %s", (dungeon_id, ))
    dungeon = cursor.fetchone()
    cursor.close()
    return dungeon

