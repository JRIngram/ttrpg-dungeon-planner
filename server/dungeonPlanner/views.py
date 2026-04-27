"""
Defines the views for the dungeon planner app
"""
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
import copy

from dungeonPlanner.serializers import (
    DungeonSerializer,
    MonsterSerializer,
    RoomSerializer,
    TrapSerializer,
    EncounterMultiplierConfigRowSerializer,
    EncounterRatingConfigRowSerializer
)
from .models import (
    Dungeon,
    EncounterMultiplierConfigRow,
    EncounterRatingConfigRow,
    Monster,
    Room,
    Trap,
)


def index(request):
    """
    Defines interactions on singular room

    Allows for retrieving, updating and d
    Defines the index for the dungeon app
    """
    return HttpResponse("Hello world!")

class DungeonList(generics.ListCreateAPIView):
    """
    Lists all dungeons, or allows the creation of a new dungeons

    Defines interactions on singular room

    Allows for retrieving, updating and d
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
    Lists all EncounterMultiplierConfigRow, 
    or allows the creation of a new EncounterMultiplierConfigRow

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
    Lists all EncounterRatingConfigRow, 
    or allows the creation of a new EncounterRatingConfigRow

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

class DungeonExportJSON(generics.RetrieveAPIView):
    """
    Exports a dungeon as JSON including all rooms, monsters, and traps
    """
    queryset = Dungeon.objects.all()
    serializer_class = DungeonSerializer
    lookup_field = "id"

    def retrieve(self, request, *args, **kwargs):
        """
        Custom retrieve method to include rooms with their monsters and traps
        """
        instance = self.get_object()

        # Get all rooms for this dungeon with prefetched monsters and traps
        rooms = Room.objects.filter(dungeon=instance).prefetch_related(
            'monsters', 'traps',
            'roommonster_set__monster',
            'roomtrap_set__trap'
        )

        # Serialize the dungeon
        dungeon_data = DungeonSerializer(instance).data

        # Serialize rooms with their monsters and traps
        rooms_data = []
        for room in rooms:
            room_serializer = RoomSerializer(room)
            rooms_data.append(room_serializer.data)

        # Combine all data
        export_data = {
            'dungeon': dungeon_data,
            'rooms': rooms_data
        }

        response = JsonResponse(export_data)
        response['Content-Disposition'] = f'attachment; filename="{dungeon_data["name"]}.json"'

        return response

class DungeonExportMarkdown(generics.RetrieveAPIView):
    """
    Exports a dungeon as JSON including all rooms, monsters, and traps
    """
    queryset = Dungeon.objects.all()
    serializer_class = DungeonSerializer
    lookup_field = "id"

    def build_markdown_string(self, dungeon_json):
        print("printing dungeon_json:")
        print(dungeon_json)
        markdown_string = ""
        dungeon_header = dungeon_json["header"]
        dungeon_rooms = dungeon_json["rooms"];
        monster_set = set()
        trap_set = set()

        dungeon_header = f"# {dungeon_header["name"]}" \
        "\n## Summary" \
        f"\n{dungeon_header["summary"]}" \
        f"\nFor {dungeon_header["player_count"]} player characters levels {dungeon_header["level_min"]} - {dungeon_header["level_max"]}.\n"

        room_strings = ["\n## Rooms"]
        for room in dungeon_rooms:
            room_markdown = ""
            room_header = f"\n### {room["name"]}" \
            f"\n{room["description"]}"

            traps = room["traps"]
            monsters = room["monsters"]

            trap_strings = ["\n\nThe room contains the following traps:"] 
            for trap in traps:
                trap_strings.append(f"- {trap["quantity"]} {trap["name"]}s")

                # Copy trap to set for later use in appendicies generation
                # Remove quantity to allow for accurate de-duping
                trap_copy = copy.deepcopy(trap)
                trap_copy.pop('quantity') 


                # Frozen set ensures the trap is immutable and thus hashable, which allows adding to set
                trap_set.add(frozenset(trap_copy.items())) 
            trap_markdown = "\n".join(trap_strings)

            monster_strings = ["\n\nThe room contains the following monsters:"] 
            raw_total_xp = 0
            for monster in monsters:
                monster_quantity = monster["quantity"]
                monster_strings.append(f"- {monster["quantity"]} {monster["name"]}s")
                raw_total_xp = raw_total_xp + (monster["xp"]*monster_quantity)

                # Copy monster to set for later use in appendicies generation
                # Remove quantity to allow for accurate de-duping
                monster_copy = copy.deepcopy(monster)
                monster_copy.pop('quantity') 

                # Frozen set ensures the trap is immutable and thus hashable, which allows adding to set
                monster_set.add(frozenset(monster_copy.items()))
            monster_strings.append(f"Total monster XP: {raw_total_xp}xp")

            monster_markdown = "\n".join(monster_strings)

            room_markdown = room_markdown + room_header + trap_markdown + monster_markdown

            room_strings.append(room_markdown)
        joined_room_strings = "\n".join(room_strings)

        appendicies = ["\n\n## Appendicies"]
        monster_appendix = ["\n### Monsters"]
        print(trap_set)
        for monster in monster_set:
            unfrozen_monster = dict(monster)
            monster_appendix.append(f"- {unfrozen_monster["name"]} - {unfrozen_monster["xp"]}")
        monster_appendix_markdown = "\n".join(monster_appendix)
        appendicies.append(monster_appendix_markdown)

        trap_appendix = ["\n### Traps"]
        for trap in trap_set:
            unfrozen_trap = dict(trap)
            trap_appendix.append(f"- {unfrozen_trap["name"]} - {unfrozen_trap["effect"]}")
        trap_appendix_markdown = "\n".join(trap_appendix)
        appendicies.append(trap_appendix_markdown)

        appendicies_markdown = "\n".join(appendicies)

        markdown_string = markdown_string + dungeon_header + joined_room_strings + appendicies_markdown

        return markdown_string

    def retrieve(self, request, *args, **kwargs):
        """
        Custom retrieve method to include rooms with their monsters and traps
        """
        instance = self.get_object()

        # Get all rooms for this dungeon with prefetched monsters and traps
        rooms = Room.objects.filter(dungeon=instance).prefetch_related(
            'monsters', 'traps',
            'roommonster_set__monster',
            'roomtrap_set__trap'
        )

        # Serialize the dungeon
        dungeon_data = DungeonSerializer(instance).data

        # Serialize rooms with their monsters and traps
        rooms_data = []
        for room in rooms:
            room_serializer = RoomSerializer(room)
            rooms_data.append(room_serializer.data)

        # Combine all data
        dungeon_and_room_data = {
            'header': dungeon_data,
            'rooms': rooms_data
        }
        
        dungeon_markdown = self.build_markdown_string(dungeon_and_room_data)



        response = JsonResponse(dungeon_and_room_data)
        response['Content-Disposition'] = f'attachment; filename="{dungeon_data["name"]}.md"'

        return HttpResponse(dungeon_markdown)