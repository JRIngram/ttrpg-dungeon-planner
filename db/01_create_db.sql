CREATE TABLE IF NOT EXISTS dungeon(
	id SERIAL PRIMARY KEY,
	name TEXT,
	summary TEXT,
	level_min SMALLINT,
	level_max SMALLINT,
	player_count SMALLINT
);

CREATE TABLE IF NOT EXISTS room(
	id SERIAL PRIMARY KEY,
	dungeon_id INT REFERENCES dungeon(id),
	name TEXT,
	description TEXT
);

CREATE TABLE IF NOT EXISTS trap(
	id SERIAL PRIMARY KEY,
	name TEXT,
	effect TEXT
);

CREATE TABLE IF NOT EXISTS monster(
	id SERIAL PRIMARY KEY,
	name TEXT,
	xp INT
);

CREATE TABLE IF NOT EXISTS room_monster(
	room_id SERIAL REFERENCES room(id),
	monster_id SERIAL REFERENCES monster(id)
);

CREATE TABLE IF NOT EXISTS room_trap(
	room_id SERIAL REFERENCES room(id),
	trap_id SERIAL REFERENCES trap(id)
);