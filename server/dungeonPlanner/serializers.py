"""
Defines serializers for the dungeonPlanner app
"""

from rest_framework import serializers
from dungeonPlanner.models import (
    Dungeon,
    EncounterMultiplierConfigRow,
    EncounterRatingConfigRow,
    Monster,
    Room,
    RoomMonster,
    RoomTrap,
    Trap
)

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
    """
    Serializer for the RoomMonster model
    """
    class Meta:
        model= RoomMonster
        fields = ['monster', 'quantity']

class RoomTrapSerializer(serializers.ModelSerializer):
    """
    Serializer for the RoomTrap model
    """
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

        # Ensures responses includes recently added monsters and traps
        room.refresh_from_db()

        return room

    def update(self, instance, validated_data):
        traps = validated_data.pop('roomtrap_set', [])
        monsters = validated_data.pop("roommonster_set", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        for monster in monsters:
            room_monster, created = RoomMonster.objects.get_or_create(
                room=instance,
                monster=monster['monster'],
                defaults={"quantity": monster['quantity']}
            )

            if created is False:
                room_monster.quantity = monster['quantity']
                room_monster.save()

        for trap in traps:
            room_trap, created = RoomTrap.objects.get_or_create(
                room=instance,
                trap=trap['trap'],
                defaults={"quantity": trap['quantity']}
            )

            if created is False:
                room_trap.quantity = trap['quantity']
                room_trap.save()

        instance.save()
        # Ensures responses includes recently added monsters and traps
        instance.refresh_from_db()

        return instance

    def to_representation(self, instance):
        """
        Adds monsters and traps fields to the room return value
        """
        representation = super().to_representation(instance)

        representation['monsters'] = self.map_monsters_with_roommonster(instance)
        representation['traps'] = self.map_trap_with_roomtrap(instance)
        return representation

    def map_monsters_with_roommonster(self, instance):
        """
        Combines RoomMonster data with monster data and returns that value

        Used to return monster data _and_ quantity data taken from RoomMonster models

        e.g. 
            room_monsters   =   [{'monster': 40, 'quantity': 1}]
            monsters        =   [{'id': 40, 'name': 'Goblin', 'xp': 50}]
            return value    =   [{'id': 40, 'name': 'Goblin', 'xp': 50, 'quantity': 1}]
        """

        room_monsters = RoomMonsterSerializer(instance.roommonster_set, many=True).data
        monsters = MonsterSerializer(instance.monsters.all(), many=True).data
        for monster in monsters:
            for room_monster in room_monsters:
                if room_monster['monster'] == monster['id']:
                    monster['quantity'] = room_monster['quantity']
        return monsters

    def map_trap_with_roomtrap(self, instance):
        """
        Combines RoomTrap data with trap data and returns that value

        Used to return trap data _and_ quantity data taken from RoomTrap models

        e.g. 
            room_traps    =   [{'trap': 40, 'quantity': 1}]
            traps         =   [{'id': 40, 'name': 'Hidden Pit', 'effect': '1d4 bludgeoning'}]
            return value  =   [
                    {'id': 40, 'name': 'Hidden Pit', 'effect': '1d4 bludgeoning', 'quantity': 1}
            ]
        """

        room_traps = RoomTrapSerializer(instance.roomtrap_set, many=True).data
        traps = TrapSerializer(instance.traps.all(), many=True).data
        for trap in traps:
            for room_trap in room_traps:
                if room_trap['trap'] == trap['id']:
                    trap['quantity'] = room_trap['quantity']
        return traps

class EncounterMultiplierConfigRowSerializer(serializers.ModelSerializer):
    """
    Serializer for EncounterMultiplierConfigRow model, 
    which controls the multiplying of an encounter's XP based on the number of monsters
    """

    min = serializers.IntegerField(min_value=0, max_value=32767, required=True)
    max = serializers.IntegerField(min_value=0, max_value=32767, required=False, allow_null=True)
    multiplier = serializers.FloatField(required=True)

    class Meta:
        """
        Define serializer fields
        """

        model = EncounterMultiplierConfigRow
        fields = ['id', 'min', 'max', 'multiplier']

    def create(self, validated_data):
        """
        Creates a EncounterMultiplierConfig from validated data
        """

        return EncounterMultiplierConfigRow.objects.create(**validated_data)
    
class EncounterRatingConfigRowSerializer(serializers.ModelSerializer):
    """
    Serializer for EncounterRatiingConfigRow model, 
    which controls the rating of an encounter based on player levels and adjusted xp
    """

    level = serializers.IntegerField(min_value=0, max_value=32767, required=True)
    easy = serializers.IntegerField(min_value=0, max_value=32767, required=True)
    medium = serializers.IntegerField(min_value=0, max_value=32767, required=True)
    hard = serializers.IntegerField(min_value=0, max_value=32767, required=True)
    extreme = serializers.IntegerField(min_value=0, max_value=32767, required=True)

    class Meta:
        """
        Define serializer fields
        """

        model = EncounterRatingConfigRow
        fields = ['id', 'level', 'easy', 'medium', 'hard', 'extreme']

    def create(self, validated_data):
        """
        Creates a EncounterMultiplierConfig from validated data
        """

        return EncounterRatingConfigRow.objects.create(**validated_data)
