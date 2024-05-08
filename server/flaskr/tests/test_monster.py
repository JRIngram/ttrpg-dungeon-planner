"""
    Tests for the TMonsterGatewaySingleton
"""
from db.monster import MonsterGatewaySingleton

class MockMonsterCursorWithResults:
    def __init__(self):
        return

    def execute(query: str, vars=None) -> None:
        return

    def close() -> None:
        return

    def fetchall():
        mock_monster_table = [
            {
                "id": 1,
                "name": "Test Monster 1",
                "xp": 25
            },
            {
                "id": 2,
                "name": "Test Monster 2",
                "xp": 100
            }
        ]
        return mock_monster_table

    def fetchone():
        return {
            "id": 1,
            "name": "Test Monster 1",
            "xp": 25
        }

class MockMonsterCursorWithoutResults:
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
        return MockMonsterCursorWithResults
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
        return MockMonsterCursorWithoutResults
    # pylint: enable=too-few-public-methods

def test_select_all_monsters_returns_a_list_of_monsters(mocker):
    execute_spy = mocker.spy(MockMonsterCursorWithResults, "execute")
    close_spy = mocker.spy(MockMonsterCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    monster_gateway = MonsterGatewaySingleton()
    db_response = monster_gateway.select_all_monsters()

    execute_spy.assert_called_once_with("SELECT * FROM monster",)
    close_spy.assert_called_once()
    assert len(db_response) == 2
    for monster in db_response:
        assert (type(monster["id"]) is int and monster["id"] != "") == True
        assert (type(monster["name"]) is str and monster["name"] != "") == True
        assert (type(monster["xp"]) is int and monster["xp"] != "") == True

    assert db_response[0]["id"] == 1
    assert db_response[0]["name"] == "Test Monster 1"
    assert db_response[0]["xp"] == 25

def test_select_all_monsters_returns_empty_array_if_no_monsters(mocker):
    execute_spy = mocker.spy(MockMonsterCursorWithoutResults, "execute")
    close_spy = mocker.spy(MockMonsterCursorWithoutResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithoutResults)
    monster_gateway = MonsterGatewaySingleton()
    db_response = monster_gateway.select_all_monsters()

    execute_spy.assert_called_once_with("SELECT * FROM monster",)
    close_spy.assert_called_once()
    assert len(db_response) == 0

def test_select_monster_by_id_returns_a_monster_dict(mocker):
    execute_spy = mocker.spy(MockMonsterCursorWithResults, "execute")
    close_spy = mocker.spy(MockMonsterCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    monster_gateway = MonsterGatewaySingleton()
    db_response = monster_gateway.select_monster_by_id("1")

    execute_spy.assert_called_once_with(
        "SELECT * FROM monster WHERE id = %s", ("1", )
    )
    close_spy.assert_called_once()
    print('RESP', db_response)

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Monster 1"
    assert db_response["xp"] == 25

def test_select_monster_by_id_returns_none_if_no_result(mocker):
    execute_spy = mocker.spy(MockMonsterCursorWithoutResults, "execute")
    close_spy = mocker.spy(MockMonsterCursorWithoutResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithoutResults)
    monster_gateway = MonsterGatewaySingleton()
    db_response = monster_gateway.select_monster_by_id("1")

    execute_spy.assert_called_once_with(
        "SELECT * FROM monster WHERE id = %s", ("1", )
    )
    close_spy.assert_called_once()

    assert db_response == None

def test_insert_monster_returns_inserted_entry(mocker):
    execute_spy = mocker.spy(MockMonsterCursorWithResults, "execute")
    close_spy = mocker.spy(MockMonsterCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    monster_gateway = MonsterGatewaySingleton()
    db_response = monster_gateway.insert_monster(
        "Test Monster 1", 25)

    execute_spy.assert_called_once_with(
        "INSERT INTO monster(name, xp) VALUES(%s, %s) RETURNING *", ("Test Monster 1",
                                                                      25)
    )
    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Monster 1"
    assert db_response["xp"] == 25

def test_update_monster_returns_updated_entry(mocker):
    execute_spy = mocker.spy(MockMonsterCursorWithResults, "execute")
    close_spy = mocker.spy(MockMonsterCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    monster_gateway = MonsterGatewaySingleton()
    db_response = monster_gateway.update_monster(
        "1", "Test Monster 2", 50
    )

    execute_spy.assert_called_once_with(
        "UPDATE monster SET name=%s, xp=%s WHERE id = %s RETURNING *",
        ("Test Monster 2", 50, "1")
    )
    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Monster 1"
    assert db_response["xp"] == 50

def test_update_monster_returns_updated_entry(mocker):
    execute_spy = mocker.spy(MockMonsterCursorWithResults, "execute")
    close_spy = mocker.spy(MockMonsterCursorWithResults, "close")
    mocker.patch("psycopg2.connect", MockConnectionWithResults)
    monster_gateway = MonsterGatewaySingleton()
    db_response = monster_gateway.delete_monster(
        "1",
    )

    assert execute_spy.call_count == 2
    execute_spy.assert_any_call(
        "DELETE FROM room_monster WHERE monster_id = %s RETURNING *;",
        ("1",)
    )
    execute_spy.assert_any_call(
        "DELETE FROM monster WHERE id = %s RETURNING *;",
        ("1", )
    )

    close_spy.assert_called_once()

    assert db_response["id"] == 1
    assert db_response["name"] == "Test Monster 1"
    assert db_response["xp"] == 25