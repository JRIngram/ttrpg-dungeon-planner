"""
    Flask server for dnd5e-dungeon-planner.
    Primarily interacts with the postgresql database and serves records to the users.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_parameter_validation import ValidateParameters, Route, Json

from db.dungeon import DungeonGatewaySingleton
from db.trap import TrapGatewaySingleton
from db.monster import MonsterGatewaySingleton

app = Flask(__name__)
CORS(app)

dungeon_gateway = DungeonGatewaySingleton()
monster_gateway = MonsterGatewaySingleton()
trap_gateway = TrapGatewaySingleton()


@app.route("/dungeon")
def get_dungeon():
    """Fetches all dungeons in the database"""
    dungeons = dungeon_gateway.select_all_dungeons()
    return jsonify(dungeons)


@app.route("/dungeon/<int:dungeon_id>")
def get_dungeon_by_id(dungeon_id):
    """Fetches the dungeon that matches dungeon_id from the database"""
    dungeon = dungeon_gateway.select_dungeon_by_id(dungeon_id)
    if dungeon is None:
        return jsonify({})
    return jsonify(dungeon)

# Trap Endpoints
@app.route('/trap')
def get_trap():
    """Fetches all traps in the database"""
    traps = trap_gateway.select_all_traps()
    return jsonify(traps)


@app.route('/trap/<int:trap_id>')
def get_trap_by_id(trap_id):
    """Fetches the trap that matches the trap_id from the database"""
    trap = trap_gateway.select_trap_by_id(trap_id)
    return jsonify(trap)


@app.route('/trap', methods=['POST'])
def create_trap():
    """Creates a trap using trap_name and trap_effect"""
    trap_name = request.form['trap_name']
    trap_effect = request.form['trap_effect']
    trap = trap_gateway.insert_trap(trap_name, trap_effect)
    return jsonify(trap)


@app.route('/trap/<int:trap_id>', methods=['PUT'])
def edit_trap(trap_id):
    """Updates the trap in the database that matches trap_id"""
    trap_name = request.form['trap_name']
    trap_effect = request.form['trap_effect']
    edited_trap = trap_gateway.update_trap(trap_id, trap_name, trap_effect)
    return jsonify(edited_trap)


@app.route('/trap/<int:trap_id>', methods=['DELETE'])
def delete_trap_by_id(trap_id):
    """Deletes trap from the database that matches trap_id"""
    trap = trap_gateway.delete_trap(trap_id)
    return jsonify(trap)

# Monster Endpoints
@app.route('/monster')
def get_monster():
    """Fetches all monsters in the database"""
    monsters = monster_gateway.select_all_monsters()
    return jsonify(monsters)


@app.route('/monster/<int:monster_id>')
@ValidateParameters()
def get_monster_by_id(monster_id: str = Route()):
    """Fetches the monster that matches the monster_id from the database"""
    monster = monster_gateway.select_monster_by_id(monster_id)
    return jsonify(monster)


@app.route('/monster', methods=['POST'])
@ValidateParameters()
def create_monster(
    monster_name: str = Json(min_str_length = 1, pattern="(\\w|\\s){1,}"),
    monster_xp: int = Json(min_int = 1)
):
    """Creates a monster using monster_name and monster_xp"""
    request_data = request.get_json()
    monster_name = request_data['monster_name']
    monster_xp = request_data['monster_xp']
    monster = monster_gateway.insert_monster(monster_name, monster_xp)
    return jsonify(monster)


@app.route('/monster/<int:monster_id>', methods=['PUT'])
@ValidateParameters()
def edit_monster(
    monster_id: str = Route(),
    monster_name: str = Json(min_str_length = 1, pattern="\\w{1,}"),
    monster_xp: int = Json(min_int = 1)
    ):
    """Updates the monster in the database that matches monster_id"""
    request_data = request.get_json()
    monster_name = request_data['monster_name']
    monster_xp = request_data['monster_xp']
    edited_monster = monster_gateway.update_monster(monster_id, monster_name, monster_xp)
    return jsonify(edited_monster)


@app.route('/monster/<int:monster_id>', methods=['DELETE'])
def delete_monster_by_id(
    monster_id: str
):
    """Deletes monster from the database that matches monster_id"""
    can_delete_monster = monster_gateway.can_delete_monster(monster_id)
    if can_delete_monster:
        monster = monster_gateway.delete_monster(monster_id)
        if monster is None:
            return jsonify({ "message": "Monster does not exist", "monster_id": monster_id}), 404
        return jsonify(monster)
    return jsonify({"message": "Unable to delete. Monster in use"}), 400
