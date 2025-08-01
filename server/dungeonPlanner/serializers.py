from django.contrib.auth.models import Group, User
from rest_framework import serializers
from dungeonPlanner.models import Monster

class MonsterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    xp = serializers.IntegerField(required=True)

    class Meta:
        model = Monster
        fields = ['id', 'name', 'xp']

    def create(self, validated_data):
        return Monster.objects.create(**validated_data)
    