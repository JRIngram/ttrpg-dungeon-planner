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
    monsters = serializers.PrimaryKeyRelatedField(many=True, queryset=Monster.objects.all())
    traps = serializers.PrimaryKeyRelatedField(many=True, queryset=Trap.objects.all())

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
        monsters = validated_data.pop('monsters', [])
        traps = validated_data.pop('traps', [])

        room = Room.objects.create(**validated_data)

        room.monsters.set(monsters)
        room.traps.set(traps)

        # Ensures responses includes recently added monsters and traps
        room.refresh_from_db()

        return room

    def update(self, instance, validated_data):
        monsters = validated_data.pop('monsters')
        traps = validated_data.pop('traps', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.monsters.set(monsters)
        instance.traps.set(traps)

        instance.save()
        # Ensures responses includes recently added monsters and traps
        instance.refresh_from_db()

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['monsters'] = MonsterSerializer(instance.monsters.all(), many=True).data
        representation['traps'] = TrapSerializer(instance.traps.all(), many=True).data
        return representation

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
