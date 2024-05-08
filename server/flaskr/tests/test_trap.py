"""
    Tests for the TrapGatewaySingleton
"""
from db.trap import TrapGatewaySingleton

class MockTrapCursorWithResults:
    def __init__(self):
        return

    def execute(query: str, vars=None) -> None:
        return

    def close() -> None:
        return

    def fetchall():
        mock_trap_table = [
            {
                "id": 1,
                "name": "Test Trap 1",
                "effect": "Shoots a ball of test! 1d4 test damage!"
            },
            {
                "id": 2,
                "name": "Test Trap",
                "effect": "Shoots a testing wave of psychic energy! 1d4 test damage!"
            }
        ]
        return mock_trap_table

    def fetchone():
        return {
            "id": 1,
            "name": "Test Trap 1",
            "effect": "Shoots a ball of test! 1d4 test damage!"
        }

class MockTrapCursorWithoutResults:
    def __init__(self):
        return

    def execute(query: str, vars=None) -> None:
        return

    def close() -> None:
        return

    def fetchall():
        return []

    def fetchone():
        return None

class MockConnectionWithResults:
    # pylint: disable=too-few-public-methods
    """
    Mock object for psycopg2.connect
    """

    def __init__(self, database, host, user, password, port):  # pylint: disable=too-many-arguments
        """
        Constructor for MockConnection
        """
        print({database, host, user, password, port})

    def cursor(self, cursor_factory):
        """
        Mock cursor
        """
        return MockTrapCursorWithResults
    # pylint: enable=too-few-public-methods

class MockConnectionWithoutResults:
    # pylint: disable=too-few-public-methods
    """
    Mock object for psycopg2.connect
    """

    def __init__(self, database, host, user, password, port):  # pylint: disable=too-many-arguments
        """
        Constructor for MockConnection
        """
        print({database, host, user, password, port})

    def cursor(self, cursor_factory):
        """
        Mock cursor
        """
        return MockTrapCursorWithoutResults
    # pylint: enable=too-few-public-methods

def test_select_all_traps_returns_a_list_of_traps(mocker):
    execute_spy = mocker.spy(MockTrapCursorWithResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_all_traps()

    execute_spy.assert_called_once_with("SELECT * FROM trap",)
    close_spy.assert_called_once()
    assert len(db_response) == 2
    for trap in db_response:
        assert (type(trap["id"]) is int and trap["id"] != "") == True
        assert (type(trap["name"]) is str and trap["name"] != "") == True
        assert (type(trap["effect"]) is str and trap["effect"] != "") == True

    assert db_response[0]["id"] == 1
    assert db_response[0]["name"] == "Test Trap 1"
    assert db_response[0]["effect"] == "Shoots a ball of test! 1d4 test damage!"

def test_select_all_traps_returns_empty_array_if_no_traps(mocker):
    execute_spy = mocker.spy(MockTrapCursorWithoutResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithoutResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithoutResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_all_traps()

    execute_spy.assert_called_once_with("SELECT * FROM trap",)
    close_spy.assert_called_once()
    assert len(db_response) == 0

def test_select_trap_by_id_returns_a_trap_dict(mocker):
    execute_spy = mocker.spy(MockTrapCursorWithResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_trap_by_id("1")

    execute_spy.assert_called_once_with(
        "SELECT * FROM trap WHERE id = %s", ("1", )
    )
    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Trap 1"
    assert db_response["effect"] == "Shoots a ball of test! 1d4 test damage!"

def test_select_trap_by_id_returns_none_if_no_result(mocker):
    execute_spy = mocker.spy(MockTrapCursorWithoutResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithoutResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithoutResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_trap_by_id("1")

    execute_spy.assert_called_once_with(
        "SELECT * FROM trap WHERE id = %s", ("1", )
    )
    close_spy.assert_called_once()

    assert db_response == None

def test_insert_trap_returns_inserted_entry(mocker):
    execute_spy = mocker.spy(MockTrapCursorWithResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.insert_trap(
        "Test Trap 1", "Shoots a ball of test! 1d4 test damage!")

    execute_spy.assert_called_once_with(
        "INSERT INTO trap(name, effect) VALUES(%s, %s) RETURNING *", ("Test Trap 1",
                                                                      "Shoots a ball of test! 1d4 test damage!")
    )
    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Trap 1"
    assert db_response["effect"] == "Shoots a ball of test! 1d4 test damage!"

def test_update_trap_returns_updated_entry(mocker):
    execute_spy = mocker.spy(MockTrapCursorWithResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.update_trap(
        "1", "Test Trap 1", "Shoots a ball of test! 1d4 test damage!"
    )

    execute_spy.assert_called_once_with(
        "UPDATE trap SET name=%s, effect=%s WHERE id = %s RETURNING *",
        ("Test Trap 1", "Shoots a ball of test! 1d4 test damage!", "1")
    )
    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Trap 1"
    assert db_response["effect"] == "Shoots a ball of test! 1d4 test damage!"

def test_update_trap_returns_updated_entry(mocker):
    execute_spy = mocker.spy(MockTrapCursorWithResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.delete_trap(
        "1",
    )

    assert execute_spy.call_count == 2
    execute_spy.assert_any_call(
        "DELETE FROM room_trap WHERE trap_id = %s RETURNING *;",
        ("1",)
    )
    execute_spy.assert_any_call(
        "DELETE FROM trap WHERE id = %s RETURNING *;",
        ("1", )
    )

    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Trap 1"
    assert db_response["effect"] == "Shoots a ball of test! 1d4 test damage!"