from django.contrib.auth.models import Group, User
from rest_framework import serializers
from dungeonPlanner.models import Monster

# class Monster(models.Model):
#     name = models.CharField(max_length=256)
#     xp = models.IntegerField()
    
#     def __str__(self):
#         return str(f"{self.name} - {self.xp}xp")

class MonsterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    xp = serializers.IntegerField(required=True)

    class Meta:
        model = Monster
        fields = ['id', 'name', 'xp']

    def create(self, validated_data):
        return Monster.objects.create(**validated_data)
    