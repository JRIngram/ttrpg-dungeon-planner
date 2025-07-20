"""
    A gateway file for interacting with the dungeon table within the postgreSQL database
"""

from db.singleton_metaclass import SingletonMeta
from db.connect_to_db import connect_to_db


class DungeonGatewaySingleton(metaclass=SingletonMeta):
    """
        A gateway class for the dungeon table in the postgreSQL database
    """
    def select_all_dungeons(self):
        """Returns the results of a `SELECT * dungeon` from the DB"""
        cursor = connect_to_db()
        cursor.execute("SELECT * FROM dungeon")
        dungeons = cursor.fetchall()
        cursor.close()
        return dungeons

    def select_dungeon_by_id(self, dungeon_id: str):
        """
            Returns the results of a `SELECT * FROM dungeon WHERE id = dungeon_id` from the DB
        """
        cursor = connect_to_db()
        cursor.execute("SELECT * FROM dungeon WHERE id = %s", (dungeon_id, ))
        dungeon = cursor.fetchone()
        cursor.close()
        return dungeon
