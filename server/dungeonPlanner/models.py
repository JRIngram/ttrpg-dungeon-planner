"""
Defines the models for the dungeon planner app
"""

from django.db import models

class Monster(models.Model):
    """
    Model for dungeon monsters
    """
    name = models.CharField(max_length=256)
    xp = models.IntegerField()

    def __str__(self):
        return str(f"{self.name} - {self.xp}xp")

class Trap(models.Model):
    """
    Model for dungeon traps
    """
    name = models.CharField(max_length=256)
    effect = models.CharField()

    def __str__(self):
        return str(f"{self.name}")

class Dungeon(models.Model):
    """
    Model for dungeons, top level of the dungeon-room-monster+trap
    """
    name = models.CharField()
    summary = models.CharField()
    level_min = models.IntegerField()
    level_max = models.IntegerField()
    player_count = models.IntegerField()

    def __str__(self):
        return str(f"{self.name}")

class Room(models.Model):
    """
    Model for dungeon rooms
    """
    name = models.CharField()
    description = models.CharField()
    traps = models.ManyToManyField(Trap, blank=True)
    monsters = models.ManyToManyField(Monster, blank=True)
    dungeon = models.ForeignKey(Dungeon, on_delete=models.CASCADE)

    def __str__(self):
        return str(f"{self.name}")
