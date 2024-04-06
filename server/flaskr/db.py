"""
    A module that contains the functions for running queries against the postgresql database
"""
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def __connect_to_db():
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


def select_all_dungeons():
    """Returns the results of a `SELECT * dungeon` from the DB"""
    cursor = __connect_to_db()
    cursor.execute("SELECT * FROM dungeon")
    dungeons = cursor.fetchall()
    cursor.close()
    return dungeons


def select_dungeon_by_id(dungeon_id: str):
    """
        Returns the results of a `SELECT * FROM dungeon WHERE id = dungeon_id` from the DB
    """
    cursor = __connect_to_db()
    cursor.execute("SELECT * FROM dungeon WHERE id = %s", (dungeon_id, ))
    dungeon = cursor.fetchone()
    cursor.close()
    return dungeon


def select_all_traps():
    """Returns the results of a `SELECT * trap` from the DB"""
    cursor = __connect_to_db()
    cursor.execute("SELECT * FROM trap")
    traps = cursor.fetchall()
    cursor.close()
    return traps


def select_trap_by_id(trap_id: str):
    """
        Returns the results of a `SELECT * FROM trap WHERE id = trap_id` from the DB
    """
    cursor = __connect_to_db()
    cursor.execute("SELECT * FROM trap WHERE id = %s", (trap_id, ))
    trap = cursor.fetchone()
    cursor.close()
    return trap


def insert_trap(trap_name: str, trap_effect: str):
    """Inserts a new trap record into the DB"""
    cursor = __connect_to_db()
    sql_query = "INSERT INTO trap(name, effect) VALUES(%s, %s) RETURNING *"
    cursor.execute(sql_query, (trap_name, trap_effect, ))
    trap = cursor.fetchone()
    cursor.close()
    return trap


def update_trap(trap_id: str, trap_name: str, trap_effect: str):
    """Updates the trap record in the db that matches trap_id"""
    cursor = __connect_to_db()
    sql_query = "UPDATE trap SET name=%s, effect=%s WHERE id = %s RETURNING *"
    cursor.execute(sql_query, (trap_name, trap_effect, trap_id, ))
    trap = cursor.fetchone()
    cursor.close()
    return trap


def delete_trap(trap_id: str):
    """Deletes the trap record in the db that matches the trap_id"""
    cursor = __connect_to_db()
    cursor.execute(
        'DELETE FROM room_trap WHERE trap_id = %s RETURNING *;', (trap_id, ))
    cursor.execute('DELETE FROM trap WHERE id = %s RETURNING *;', (trap_id, ))
    deleted_trap = cursor.fetchone()
    cursor.close()
    return deleted_trap
