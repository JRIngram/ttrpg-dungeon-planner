from flask import Flask, url_for
from db import select_all_dungeons, select_dungeon_by_id

app = Flask(__name__)

@app.route("/dungeon")
def get_dungeon():
    dungeons = select_all_dungeons()
    dungeon_string = ""
    for dungeon in dungeons:
        dungeon_string = f'{dungeon_string}<li>{dungeon}</li>'

    return f"<h1>Dungeons</h1><ul>{dungeon_string}</ul>"

@app.route("/dungeon/<int:dungeon_id>")
def get_dungeon_by_id(dungeon_id):
    dungeon = select_dungeon_by_id(dungeon_id)
    if dungeon is None:
        return f'<p>a dungeon with id {dungeon_id} does not exist</p>'
    return f'<p>{dungeon}</p>'

with app.test_request_context():
    print(url_for('get_dungeon'))
    print(url_for('get_dungeon_by_id', dungeon_id='10'))