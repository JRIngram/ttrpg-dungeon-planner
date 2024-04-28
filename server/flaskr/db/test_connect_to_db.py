import connect_to_db
import psycopg2

class MockConnection:
    def __init__(self, database, host, user, password, port):
         return None

    def cursor(self):
        return True

def test_connect_to_db(monkeypatch):
    monkeypatch.setattr(psycopg2, "connect", MockConnection)
    cursor = connect_to_db.connect_to_db()
    assert cursor == True