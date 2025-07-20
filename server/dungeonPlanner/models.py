from django.db import models

class Monster(models.Model):
    name = models.CharField(max_length=256)
    xp = models.IntegerField()
    
    def __str__(self):
        return str(f"{self.name} - {self.xp}xp")

class Trap(models.Model):
    name = models.CharField(max_length=256)
    effect = models.CharField()
    
    def __str__(self):
        return str(f"{self.name}")

class Dungeon(models.Model):
    name = models.CharField()
    summary = models.CharField()
    level_min = models.IntegerField()
    level_max = models.IntegerField()
    player_count = models.IntegerField()
    
    def __str__(self):
        return str(f"{self.name}")

class Room(models.Model):
    name = models.CharField()
    description = models.CharField()
    traps = models.ManyToManyField(Trap, blank=True)
    monsters = models.ManyToManyField(Monster, blank=True)
    dungeon = models.ForeignKey(Dungeon, on_delete=models.CASCADE)

    def __str__(self):
        return str(f"{self.name}")