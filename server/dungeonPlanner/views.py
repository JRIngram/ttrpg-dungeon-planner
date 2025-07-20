from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from .models import Monster, Trap, Room, Dungeon

# Create your views here.
def index(request):
    return HttpResponse("Hello world!")

def monster(request, monster_id):
    monster = get_object_or_404(Monster, pk=monster_id)
    return render(request, "dungeonPlanner/monster.html", {"monster": monster})

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