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
    connection.autocommit = True
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

def select_all_traps():
    cursor = connect_to_db()
    cursor.execute("SELECT * FROM trap")
    traps = cursor.fetchall()
    cursor.close()
    return traps

def select_trap_by_id(trap_id: str):
    cursor = connect_to_db()
    cursor.execute("SELECT * FROM trap WHERE id = %s", (trap_id, ))
    trap = cursor.fetchone()
    cursor.close()
    return trap

def insert_trap(trap_name: str, trap_effect: str):
    cursor = connect_to_db()
    sql_query = "INSERT INTO trap(name, effect) VALUES(%s, %s) RETURNING *"
    cursor.execute(sql_query, (trap_name, trap_effect, ))
    trap = cursor.fetchone()
    cursor.close()
    return trap

def update_trap(trap_id: str, trap_name: str, trap_effect: str):
    cursor = connect_to_db()
    sql_query = "UPDATE trap SET name=%s, effect=%s WHERE id = %s RETURNING *"
    cursor.execute(sql_query, (trap_name, trap_effect, trap_id, ))
    trap = cursor.fetchone()
    cursor.close()
    return trap

def delete_trap(trap_id: str):
    cursor = connect_to_db()
    cursor.execute('DELETE FROM room_trap WHERE trap_id = %s RETURNING *;', (trap_id, ))
    cursor.execute('DELETE FROM trap WHERE id = %s RETURNING *;', (trap_id, ))
    deleted_trap = cursor.fetchone()
    cursor.close()
    return deleted_trap
