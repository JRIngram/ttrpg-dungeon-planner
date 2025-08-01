"""
Defines the views for the dungeon planner app
"""
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import generics

from dungeonPlanner.serializers import MonsterSerializer
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

def trap_single(request, trap_id):
    """
    Defines interactions for traps
    """

    trap = get_object_or_404(Trap, pk=trap_id)
    return render(request, "dungeonPlanner/trap.html", {"trap": trap})

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
