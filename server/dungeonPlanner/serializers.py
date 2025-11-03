"""
Defines serializers for the dungeonPlanner app
"""

from rest_framework import serializers
from dungeonPlanner.models import Dungeon, Monster, Room, RoomMonster, RoomTrap, Trap

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

class RoomMonsterSerializer(serializers.ModelSerializer):
    class Meta:
        model= RoomMonster
        fields = ['monster', 'quantity']

class RoomTrapSerializer(serializers.ModelSerializer):
    class Meta:
        model= RoomTrap
        fields = ['trap', 'quantity']

class RoomSerializer(serializers.ModelSerializer):
    """
    Serializer for the Room model
    """

    name = serializers.CharField(required=True)
    description = serializers.CharField()
    monsters = RoomMonsterSerializer(source="roommonster_set", many=True, required=False )
    traps = RoomTrapSerializer(source="roomtrap_set", many=True, required=False)

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

        traps = validated_data.pop('roomtrap_set', [])
        monsters = validated_data.pop("roommonster_set", [])
        room = Room.objects.create(**validated_data)

        for monster in monsters:
            RoomMonster.objects.create(
                room=room,
                monster=monster['monster'],
                quantity=monster['quantity']
            )

        for trap in traps:
            RoomTrap.objects.create(
                room=room,
                trap=trap['trap'],
                quantity=trap['quantity']
            )

        # room.monsters.set(monsters)
        # room.traps.set(traps)

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

