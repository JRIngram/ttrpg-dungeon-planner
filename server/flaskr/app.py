from flask import Flask, url_for, jsonify, request
from db import select_all_dungeons, select_dungeon_by_id, select_all_traps, select_trap_by_id, delete_trap, insert_trap, update_trap

app = Flask(__name__)

@app.route("/dungeon")
def get_dungeon():
    dungeons = select_all_dungeons()
    return jsonify(dungeons)

@app.route("/dungeon/<int:dungeon_id>")
def get_dungeon_by_id(dungeon_id):
    dungeon = select_dungeon_by_id(dungeon_id)
    if dungeon is None:
        return jsonify({})
    return jsonify(dungeon)

@app.route('/trap')
def get_trap():
    traps = select_all_traps()
    return jsonify(traps)

@app.route('/trap/<int:trap_id>')
def get_trap_by_id(trap_id):
    trap = select_trap_by_id(trap_id)
    return jsonify(trap)

@app.route('/trap', methods=['POST'])
def create_trap():
    trap_name = request.form['trap_name']
    trap_effect = request.form['trap_effect']
    trap = insert_trap(trap_name, trap_effect)
    return jsonify(trap)

@app.route('/trap/<int:trap_id>', methods=['PUT'])
def edit_trap(trap_id):
    trap_name = request.form['trap_name']
    trap_effect = request.form['trap_effect']
    edited_trap = update_trap(trap_id, trap_name, trap_effect)
    return jsonify(edited_trap)

@app.route('/trap/<int:trap_id>', methods=['DELETE'])
def delete_trap_by_id(trap_id):
    trap = delete_trap(trap_id)
    return jsonify(trap)

with app.test_request_context():
    print(url_for('get_dungeon'))
    print(url_for('get_dungeon_by_id', dungeon_id='10'))