"""
    Tests for the TrapGatewaySingleton
"""
from db.trap import TrapGatewaySingleton

# pylint: disable=similarities
# pylint: disable=unused-argument
# pylint: disable=too-few-public-methods
# pylint: disable=missing-function-docstring
# pylint: disable=no-method-argument
# pylint: disable=missing-class-docstring
# pylint: disable=redefined-builtin
# pylint: disable=no-self-argument
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

class MockConnectionWithoutResults:
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
# pylint: enable=unused-argument
# pylint: enable=too-few-public-methods
# pylint: enable=missing-function-docstring
# pylint: enable=no-method-argument
# pylint: enable=missing-class-docstring
# pylint: enable=redefined-builtin
# pylint: enable=no-self-argument
# pylint: enable=similarities

def test_select_all_traps_returns_a_list_of_traps(mocker):
    """
        Tests that select_all_traps returns a list of trap dicts
    """
    execute_spy = mocker.spy(MockTrapCursorWithResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_all_traps()

    execute_spy.assert_called_once_with("SELECT * FROM trap",)
    close_spy.assert_called_once()
    assert len(db_response) == 2
    for trap in db_response:
        assert isinstance(trap["id"], int) is True
        assert isinstance(trap["name"], str) and trap["name"] != ""
        assert isinstance(trap["effect"], str) and trap["effect"] != ""

    assert db_response[0]["id"] == 1
    assert db_response[0]["name"] == "Test Trap 1"
    assert db_response[0]["effect"] == "Shoots a ball of test! 1d4 test damage!"

def test_select_all_traps_returns_empty_array_if_no_traps(mocker):
    """
    Tests that select_all_traps returns an empty array
    if there are no traps in the table
    """
    execute_spy = mocker.spy(MockTrapCursorWithoutResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithoutResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithoutResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_all_traps()

    execute_spy.assert_called_once_with("SELECT * FROM trap",)
    close_spy.assert_called_once()
    assert len(db_response) == 0

def test_select_trap_by_id_returns_a_trap_dict(mocker):
    """
    Tests that select_trap_by_id returns a trap dict
    """
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
    """
    Tests that select_trap_by_id returns None if there is no matching id
    """
    execute_spy = mocker.spy(MockTrapCursorWithoutResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithoutResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithoutResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_trap_by_id("1")

    execute_spy.assert_called_once_with(
        "SELECT * FROM trap WHERE id = %s", ("1", )
    )
    close_spy.assert_called_once()

    assert db_response is None

def test_insert_trap_returns_inserted_entry(mocker):
    """
    Tests that insert_trap returns the inserted entry
    """
    execute_spy = mocker.spy(MockTrapCursorWithResults, "execute")
    close_spy = mocker.spy(MockTrapCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.insert_trap(
        "Test Trap 1", "Shoots a ball of test! 1d4 test damage!")

    execute_spy.assert_called_once_with(
        "INSERT INTO trap(name, effect) VALUES(%s, %s) RETURNING *", 
        ("Test Trap 1", "Shoots a ball of test! 1d4 test damage!")
    )
    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Trap 1"
    assert db_response["effect"] == "Shoots a ball of test! 1d4 test damage!"

def test_update_trap_returns_updated_entry(mocker):
    """
    Tests that update_trap returns the updated entry
    """
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

def test_delete_trap_returns_updated_entry(mocker):
    """
    Tests that delete_trap returns the deleted entry
    """
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
