"""
Defines Django tests for the dungeonPlanner app
"""

from django.test import TestCase
from dungeonPlanner.models import Monster


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
