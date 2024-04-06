"""
    Flask server for dnd5e-dungeon-planner.
    Primarily interacts with the postgresql database and serves records to the users.
"""

from flask import Flask, jsonify, request
from db.dungeon import DungeonGatewaySingleton
from db.trap import TrapGatewaySingleton

app = Flask(__name__)

trap_gateway = TrapGatewaySingleton()
dungeon_gateway = DungeonGatewaySingleton()


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
