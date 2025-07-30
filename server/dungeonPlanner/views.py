from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Monster, Trap, Room, Dungeon
from rest_framework import generics

from dungeonPlanner.models import Monster
from dungeonPlanner.serializers import MonsterSerializer


def index(request):
    return HttpResponse("Hello world!")

class MonsterList(generics.ListCreateAPIView):
    """
    Lists all monsters, or allows the creation of a new monster

    Uses generic ListCreateAPIView to handle get and post requests
    """
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer

class MonsterSingle(generics.RetrieveUpdateDestroyAPIView):
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer
    lookup_field = "id"

def trap(request, trap_id):
    trap = get_object_or_404(Trap, pk=trap_id)
    return render(request, "dungeonPlanner/trap.html", {"trap": trap})

def room(request, room_id):
    room = get_object_or_404(Room, pk=room_id)
    return render(request, "dungeonPlanner/room.html", {"room": room})

def dungeon(request, dungeon_id):
    dungeon = get_object_or_404(Dungeon, pk=dungeon_id)
    print(dungeon.rooms)
    return render(request, "dungeonPlanner/dungeon.html", {"dungeon": dungeon})