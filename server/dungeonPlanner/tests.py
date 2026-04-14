"""
Defines Django tests for the dungeonPlanner app
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from dungeonPlanner.models import Monster, Dungeon, Room, Trap, RoomMonster, RoomTrap

class MonsterTestCase(TestCase):
    """
    Tests for the monster model
    """

    def setUp(self):
        """
        Creates an Imp in the dp
        """
        Monster.objects.create(name="Imp", xp="25")

    def test_monster_properties_set_correct(self):
        """
        Fairly boiler plate test. Just ensures the imp is created correctly
        """
        imp = Monster.objects.get(name="Imp")
        self.assertEqual(imp.name, "Imp")
        self.assertEqual(imp.xp, 25)

class DungeonExportJSONTestCase(TestCase):
    """
    Tests for the DungeonExportJSON view
    """

    def setUp(self):
        """
        Create test data for dungeon export
        """
        # Create a dungeon
        self.dungeon = Dungeon.objects.create(
            name="Test Dungeon",
            summary="A test dungeon for export",
            level_min=1,
            level_max=5,
            player_count=4
        )
        
        # Create monsters
        self.goblin = Monster.objects.create(name="Goblin", xp=50)
        self.orc = Monster.objects.create(name="Orc", xp=100)
        
        # Create traps
        self.pit_trap = Trap.objects.create(name="Pit Trap", effect="1d6 damage")
        self.poison_dart = Trap.objects.create(name="Poison Dart", effect="1d4 damage")
        
        # Create rooms
        self.room1 = Room.objects.create(
            name="Entrance Hall",
            description="A large hall with torches",
            dungeon=self.dungeon
        )
        
        self.room2 = Room.objects.create(
            name="Treasure Room", 
            description="A room filled with gold",
            dungeon=self.dungeon
        )
        
        # Add monsters to rooms
        RoomMonster.objects.create(room=self.room1, monster=self.goblin, quantity=3)
        RoomMonster.objects.create(room=self.room1, monster=self.orc, quantity=1)
        RoomMonster.objects.create(room=self.room2, monster=self.goblin, quantity=2)
        
        # Add traps to rooms
        RoomTrap.objects.create(room=self.room1, trap=self.pit_trap, quantity=1)
        RoomTrap.objects.create(room=self.room2, trap=self.poison_dart, quantity=2)

    def test_dungeon_export_json_endpoint(self):
        """
        Test that the dungeon export JSON endpoint works correctly
        """
        client = APIClient()
        url = reverse('dungeon-export-json', kwargs={'id': self.dungeon.id})
        response = client.get(url)
        
        # Check response status
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        self.assertIn('dungeon', response.data)
        self.assertIn('rooms', response.data)
        
        # Check dungeon data
        dungeon_data = response.data['dungeon']
        self.assertEqual(dungeon_data['id'], self.dungeon.id)
        self.assertEqual(dungeon_data['name'], "Test Dungeon")
        self.assertEqual(dungeon_data['summary'], "A test dungeon for export")
        self.assertEqual(dungeon_data['level_min'], 1)
        self.assertEqual(dungeon_data['level_max'], 5)
        self.assertEqual(dungeon_data['player_count'], 4)
        
        # Check rooms data
        rooms_data = response.data['rooms']
        self.assertEqual(len(rooms_data), 2)
        
        # Find room1 data
        room1_data = next(room for room in rooms_data if room['id'] == self.room1.id)
        self.assertEqual(room1_data['name'], "Entrance Hall")
        self.assertEqual(room1_data['description'], "A large hall with torches")
        self.assertEqual(len(room1_data['monsters']), 2)
        self.assertEqual(len(room1_data['traps']), 1)
        
        # Check monsters in room1
        goblin = next(m for m in room1_data['monsters'] if m['name'] == "Goblin")
        orc = next(m for m in room1_data['monsters'] if m['name'] == "Orc")
        self.assertEqual(goblin['quantity'], 3)
        self.assertEqual(orc['quantity'], 1)
        
        # Check traps in room1
        pit_trap = next(t for t in room1_data['traps'] if t['name'] == "Pit Trap")
        self.assertEqual(pit_trap['quantity'], 1)
        
        # Find room2 data
        room2_data = next(room for room in rooms_data if room['id'] == self.room2.id)
        self.assertEqual(room2_data['name'], "Treasure Room")
        self.assertEqual(room2_data['description'], "A room filled with gold")
        self.assertEqual(len(room2_data['monsters']), 1)
        self.assertEqual(len(room2_data['traps']), 1)
        
        # Check monsters in room2
        goblin_room2 = next(m for m in room2_data['monsters'] if m['name'] == "Goblin")
        self.assertEqual(goblin_room2['quantity'], 2)
        
        # Check traps in room2
        poison_dart = next(t for t in room2_data['traps'] if t['name'] == "Poison Dart")
        self.assertEqual(poison_dart['quantity'], 2)
