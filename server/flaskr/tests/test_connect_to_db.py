"""
Tests for connect_to_db()
"""
from db import connect_to_db

class MockConnection:
    # pylint: disable=too-few-public-methods
    """
    Mock object for psycopg2.connect
    """
    def __init__(self, database, host, user, password, port): # pylint: disable=too-many-arguments
        """
        Constructor for MockConnection
        """
        print({ database, host, user, password, port })

    def cursor(self):
        """
        Mock cursor
        """
        return True
    # pylint: enable=too-few-public-methods

def test_cursor_called_on_connect_to_db(mocker):
    """
    Tests that psycopg2.connection.cursor
    is called when connect_to_db() is called
    """
    spy = mocker.spy(MockConnection, "cursor")
    mocker.patch('psycopg2.connect', MockConnection)
    connect_to_db.connect_to_db()
    assert spy.call_count == 1
