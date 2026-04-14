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
