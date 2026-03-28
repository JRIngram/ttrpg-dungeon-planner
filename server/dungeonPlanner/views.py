"""
Defines the views for the dungeon planner app
"""
from django.http import HttpResponse
from rest_framework import generics

from dungeonPlanner.serializers import (
    DungeonSerializer,
    MonsterSerializer,
    RoomSerializer,
    TrapSerializer,
    EncounterMultiplierConfigRowSerializer,
    EncounterRatingConfigRowSerializer
)
from .models import Monster, Trap, Room, Dungeon, EncounterMultiplierConfigRow, EncounterRatingConfigRow


def index(request):
    """
    Defines the index for the dungeon app
    """
    return HttpResponse("Hello world!")

class DungeonList(generics.ListCreateAPIView):
    """
    Lists all dungeons, or allows the creation of a new dungeons

    Uses generic ListCreateAPIView to handle get and post requests
    """
    queryset = Dungeon.objects.all()
    serializer_class = DungeonSerializer

class DungeonSingle(generics.RetrieveUpdateDestroyAPIView):
    """
    Defines interactions on singular dungeons

    Allows for retrieving, updating and destroying
    """
    queryset = Dungeon.objects.all()
    serializer_class = DungeonSerializer
    lookup_field = "id"

class MonsterList(generics.ListCreateAPIView):
    """
    Lists all monsters, or allows the creation of a new monster

    Uses generic ListCreateAPIView to handle get and post requests
    """
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer

class MonsterSingle(generics.RetrieveUpdateDestroyAPIView):
    """
    Defines interactions on singular monsters

    Allows for retrieving, updating and destroying
    """
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer
    lookup_field = "id"

class RoomList(generics.ListCreateAPIView):
    """
    Lists all Rooms or allows the creation of new rooms

    Uses generic ListCreateAPIView to handle get and post requests
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class RoomSingle(generics.RetrieveUpdateDestroyAPIView):
    """
    Defines interactions on singular room

    Allows for retrieving, updating and destroying
    """
    serializer_class = RoomSerializer
    queryset = Room.objects.all().prefetch_related('monsters', 'traps')
    lookup_field = 'id'

class TrapList(generics.ListCreateAPIView):
    """
    Lists all traps, or allows the creation of a new traps

    Uses generic ListCreateAPIView to handle get and post requests
    """
    queryset = Trap.objects.all()
    serializer_class = TrapSerializer

class TrapSingle(generics.RetrieveUpdateDestroyAPIView):
    """
    Defines interactions on singular traps

    Allows for retrieving, updating and destroying
    """
    queryset = Trap.objects.all()
    serializer_class = TrapSerializer
    lookup_field = "id"

class EncounterMultiplierConfigRowList(generics.ListCreateAPIView):
    """
    Lists all EncounterMultiplierConfigRow, or allows the creation of a new EncounterMultiplierConfigRow

    Uses generic ListCreateAPIView to handle get and post requests
    """
    queryset = EncounterMultiplierConfigRow.objects.all()
    serializer_class = EncounterMultiplierConfigRowSerializer
    lookup_field = "id"

class EncounterMultiplierConfigRowSingle(generics.RetrieveDestroyAPIView):
    """
    Defines interactions on singular EncounterMultiplierConfigRow

    Allows for retrieving, updating and destroying
    """
    queryset = EncounterMultiplierConfigRow.objects.all()
    serializer_class = EncounterMultiplierConfigRowSerializer
    lookup_field = "id"

# EncounterRatingConfigRowSerializer

class EncounterRatingConfigRowList(generics.ListCreateAPIView):
    """
    Lists all EncounterRatingConfigRow, or allows the creation of a new EncounterRatingConfigRow

    Uses generic ListCreateAPIView to handle get and post requests
    """
    queryset = EncounterRatingConfigRow.objects.all()
    serializer_class = EncounterRatingConfigRowSerializer
    lookup_field = "id"

class EncounterRatingConfigRowSingle(generics.RetrieveDestroyAPIView):
    """
    Defines interactions on singular EncounterRatingConfigRow

    Allows for retrieving, updating and destroying
    """
    queryset = EncounterRatingConfigRow.objects.all()
    serializer_class = EncounterRatingConfigRowSerializer
    lookup_field = "id"