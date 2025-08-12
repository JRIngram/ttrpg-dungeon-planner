"""
Defines the views for the dungeon planner app
"""
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import generics

from dungeonPlanner.serializers import MonsterSerializer, TrapSerializer
from .models import Monster, Trap, Room, Dungeon


def index(request):
    """
    Defines the index for the dungeon app
    """
    return HttpResponse("Hello world!")

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

def room_single(request, room_id):
    """
    Defines interactions for rooms
    """

    room = get_object_or_404(Room, pk=room_id)
    return render(request, "dungeonPlanner/room.html", {"room": room})

def dungeon_single(request, dungeon_id):
    """
    Defines interactions for dungeons
    """
    dungeon = get_object_or_404(Dungeon, pk=dungeon_id)
    print(dungeon.rooms)
    return render(request, "dungeonPlanner/dungeon.html", {"dungeon": dungeon})
