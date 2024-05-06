"""
    Tests for the TrapGatewaySingleton
"""
from db.trap import TrapGatewaySingleton


class MockTrapCursor:
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


class MockConnection:
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
        return MockTrapCursor
    # pylint: enable=too-few-public-methods


def test_select_all_traps_returns_a_list_of_traps(mocker):
    execute_spy = mocker.spy(MockTrapCursor, "execute")
    close_spy = mocker.spy(MockTrapCursor, "close")
    mocker.patch("psycopg2.connect", MockConnection)
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


def test_select_trap_by_id_returns_a_trap_dict(mocker):
    execute_spy = mocker.spy(MockTrapCursor, "execute")
    close_spy = mocker.spy(MockTrapCursor, "close")
    mocker.patch("psycopg2.connect", MockConnection)
    trap_gateway = TrapGatewaySingleton()
    db_response = trap_gateway.select_trap_by_id("1")

    execute_spy.assert_called_once_with(
        "SELECT * FROM trap WHERE id = %s", ("1", )
    )
    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Trap 1"
    assert db_response["effect"] == "Shoots a ball of test! 1d4 test damage!"
