"""
Defines serializers for the dungeonPlanner app
"""

from rest_framework import serializers
from dungeonPlanner.models import Monster, Trap

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
    
    def create(self, validate_data):
        """
        Creates a trap from validated data
        """

        return Trap.objects.create(**validate_data)