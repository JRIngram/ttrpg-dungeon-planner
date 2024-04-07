"""
    A gateway file for interacting with the monster table within the postgreSQL database
"""
from db.singleton_metaclass import SingletonMeta
from db.connect_to_db import connect_to_db


class MonsterGatewaySingleton(metaclass=SingletonMeta):
    """
        A gateway class for the monster table in the postgreSQL database
    """
    def select_all_monsters(self):
        """Returns the results of a `SELECT * monster` from the DB"""
        cursor = connect_to_db()
        cursor.execute("SELECT * FROM monster")
        monster = cursor.fetchall()
        cursor.close()
        return monster

    def select_monster_by_id(self, monster_id: str):
        """
            Returns the results of a `SELECT * FROM monster WHERE id = monster_id` from the DB
        """
        cursor = connect_to_db()
        cursor.execute("SELECT * FROM monster WHERE id = %s", (monster_id, ))
        monster = cursor.fetchone()
        cursor.close()
        return monster

    def insert_monster(self, monster_name: str, xp: str):
        """Inserts a new monster record into the DB"""
        cursor = connect_to_db()
        sql_query = "INSERT INTO monster(name, xp) VALUES(%s, %s) RETURNING *"
        cursor.execute(sql_query, (monster_name, xp, ))
        monster = cursor.fetchone()
        cursor.close()
        return monster

    def update_monster(self, monster_id: str, monster_name: str, monster_xp: str):
        """Updates the monster record in the db that matches monster_id"""
        cursor = connect_to_db()
        sql_query = "UPDATE monster SET name=%s, xp=%s WHERE id = %s RETURNING *"
        cursor.execute(sql_query, (monster_name, monster_xp, monster_id, ))
        monster = cursor.fetchone()
        cursor.close()
        return monster

    def delete_monster(self, monster_id: str):
        """Deletes the monster record in the db that matches the monster_id"""
        cursor = connect_to_db()
        cursor.execute(
            'DELETE FROM room_monster WHERE monster_id = %s RETURNING *;', (monster_id, ))
        cursor.execute(
            'DELETE FROM monster WHERE id = %s RETURNING *;', (monster_id, ))
        deleted_monster = cursor.fetchone()
        cursor.close()
        return deleted_monster
