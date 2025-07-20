"""
    A gateway file for interacting with the trap table within the postgreSQL database
"""
from db.singleton_metaclass import SingletonMeta
from db.connect_to_db import connect_to_db

class TrapGatewaySingleton(metaclass=SingletonMeta):
    """
        A gateway class for the trap table in the postgreSQL database
    """
    def select_all_traps(self):
        """Returns the results of a `SELECT * trap` from the DB"""
        cursor = connect_to_db()
        cursor.execute("SELECT * FROM trap")
        traps = cursor.fetchall()
        cursor.close()
        return traps

    def select_trap_by_id(self, trap_id: str):
        """
            Returns the results of a `SELECT * FROM trap WHERE id = trap_id` from the DB
        """
        cursor = connect_to_db()
        cursor.execute("SELECT * FROM trap WHERE id = %s", (trap_id, ))
        trap = cursor.fetchone()
        cursor.close()
        return trap

    def insert_trap(self, trap_name: str, trap_effect: str):
        """Inserts a new trap record into the DB"""
        cursor = connect_to_db()
        sql_query = "INSERT INTO trap(name, effect) VALUES(%s, %s) RETURNING *"
        cursor.execute(sql_query, (trap_name, trap_effect, ))
        trap = cursor.fetchone()
        cursor.close()
        return trap

    def update_trap(self, trap_id: str, trap_name: str, trap_effect: str):
        """Updates the trap record in the db that matches trap_id"""
        cursor = connect_to_db()
        sql_query = "UPDATE trap SET name=%s, effect=%s WHERE id = %s RETURNING *"
        cursor.execute(sql_query, (trap_name, trap_effect, trap_id, ))
        trap = cursor.fetchone()
        cursor.close()
        return trap

    def delete_trap(self, trap_id: str):
        """Deletes the trap record in the db that matches the trap_id"""
        cursor = connect_to_db()
        cursor.execute(
            'DELETE FROM room_trap WHERE trap_id = %s RETURNING *;', (trap_id, ))
        cursor.execute(
            'DELETE FROM trap WHERE id = %s RETURNING *;', (trap_id, ))
        deleted_trap = cursor.fetchone()
        cursor.close()
        return deleted_trap
