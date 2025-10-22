"""
Defines serializers for the dungeonPlanner app
"""

from rest_framework import serializers
from dungeonPlanner.models import Dungeon, Monster, Room, Trap

class DungeonSerializer(serializers.ModelSerializer):
    """
    Serializer for the Dungeon model
    """

    name = serializers.CharField(required=True)
    summary = serializers.CharField(required=True)
    level_min = serializers.IntegerField(required=True)
    level_max = serializers.IntegerField(required=True)
    player_count = serializers.IntegerField(required=True)

    class Meta:
        """
        Define serializer fields
        """
        model = Dungeon
        fields = ['id', 'name', 'summary', 'level_min', 'level_max', 'player_count']

    def create(self, validated_data):
        return Dungeon.objects.create(**validated_data)

class MonsterSerializer(serializers.ModelSerializer):
    """
    Serializer for the Monster model
    """
    name = serializers.CharField(required=True)
    xp = serializers.IntegerField(required=True)

    class Meta:
        """
        Define serializer fields
        """

        model = Monster
        fields = ['id', 'name', 'xp']

    def create(self, validated_data):
        """
        Creates a monster object from validated data
        """

        return Monster.objects.create(**validated_data)
    
class RoomSerializer(serializers.ModelSerializer):
    """
    Serializer for the Room model
    """

    name = serializers.CharField(required=True)
    description = serializers.CharField()

    class Meta:
        """
        Define serializer fields for Room
        """
        model = Room
        fields = ['id', 'name', 'description', 'traps', 'monsters', 'dungeon']
    
    def create(self, validated_data):
        """
        Creates a room from validated data
        """
        return Room.objects.create(**validated_data)



class TrapSerializer(serializers.ModelSerializer):
    """
    Serializer for the Trap model
    """

    name = serializers.CharField(required=True)
    effect = serializers.CharField(required=True)

    class Meta:
        """
        Define serializer fields
        """

        model = Trap
        fields = ['id', 'name', 'effect']

    def create(self, validated_data):
        """
        Creates a trap from validated data
        """

        return Trap.objects.create(**validated_data)
