INSERT INTO dungeon(name, summary, level_min, level_max, player_count) 
VALUES('test', 'a wonderful test dungeon', 1, 4, 3);

INSERT INTO room(dungeon_id, name, description)
VALUES(1, 'a test room', 'a room with a trap and a monster!');

INSERT INTO trap(name, effect)
VALUES('Test Trap', 'Shoots a ball of test! 1d4 test damage!');

INSERT INTO monster(name, xp)
VALUES('Test Monster', 25);

INSERT INTO room_monster(room_id, monster_id)
VALUES(1,1);

INSERT INTO room_trap(room_id, trap_id)
VALUES(1,1);

SELECT d.name, r.name, m.name as monster_name, m.XP as monster_xp, t.name as trap_name, t.effect as trap_effect  
FROM dungeon d
INNER JOIN room r ON d.id = r.id
INNER JOIN room_monster mr ON r.id = room_id
INNER JOIN monster m ON mr.monster_id = m.id
INNER JOIN room_trap tr ON r.id = tr.room_id
INNER JOIN trap t ON tr.trap_id = t.id;