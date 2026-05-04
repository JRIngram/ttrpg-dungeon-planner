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

    """
    Multipliers the XP of a room based on total xp, monster count
    and user generated encounter multiplier configs
    """

    def multiply_room_xp(self, total_xp, monster_count):
        multiplier_configs = EncounterMultiplierConfigRow.objects.filter(
            min__lte=monster_count,
            max__gte=monster_count
        )
        if multiplier_configs.count() == 0:
            return total_xp
        if multiplier_configs.count() != 1:
            raise Exception(
                "Multiple matching configs."
                " This suggests an error when creating the configs."
            )
        else:
            first_config = multiplier_configs.first()
            return total_xp * first_config.multiplier

    """
    Provides a room rating based on passed XP, min_player_level, max_player_level and mean players
    """

    def get_room_rating(self, adjusted_xp, player_count, min_player_level, max_player_level):
        mean_player_level = (min_player_level + max_player_level) / 2

        min_rating_config = EncounterRatingConfigRow.objects.filter(level=min_player_level)
        mean_rating_config = EncounterRatingConfigRow.objects.filter(level=mean_player_level)
        max_rating_config = EncounterRatingConfigRow.objects.filter(level=max_player_level)

        ratings_dict = {
            "min_rating": self.get_rating_from_config(adjusted_xp, player_count, min_rating_config),
            "mean_rating": self.get_rating_from_config(
                adjusted_xp, player_count,
                mean_rating_config
            ),
            "max_rating": self.get_rating_from_config(adjusted_xp, player_count, max_rating_config)
        }

        return ratings_dict

    def get_xp_per_player(self, xp, player_count):
        return xp / player_count

    """
    Calculates which rating to return from an EncounterRatingConfig based on passed xp

    Used as part of get_room_rating
    """

    def get_rating_from_config(self, encounter_xp, player_count, rating_config) -> str:
        if len(rating_config) == 0:
            return "No Config Available."

        first_config_entry = rating_config.first()
        easy = first_config_entry.easy
        medium = first_config_entry.medium
        hard = first_config_entry.hard
        extreme = first_config_entry.extreme

        xp_per_player = self.get_xp_per_player(encounter_xp, player_count)

        if xp_per_player < easy:
            return "Trivial"
        elif xp_per_player >= easy and xp_per_player < medium:
            return "Easy"
        elif xp_per_player >= medium and xp_per_player < hard:
            return "Medium"
        elif xp_per_player >= hard and xp_per_player < extreme:
            return "Hard"
        elif xp_per_player >= extreme:
            return "Extreme"
        else:
            raise Exception(
                "No matching encounter config. This suggests an error when creating the configs.")

    """
    Builds the headeer section of the markdown. Summary information about the dungeon.
    """

    def build_dungeon_header(self, dungeon_json):
        dungeon_header = dungeon_json["header"]
        dungeon_header_markdown = f"# {dungeon_header["name"]}" \
            "\n## Summary" \
            f"\n{dungeon_header["summary"]}" \
            f"\nFor {
            dungeon_header["player_count"]} player characters levels {
            dungeon_header["level_min"]} - {
            dungeon_header["level_max"]}.\n"
        return dungeon_header_markdown

    """
    Builds the markdown for the rooms of the dungeon
    """

    def build_room_markdown(self, dungeon_json):
        dungeon_rooms = dungeon_json["rooms"]
        dungeon_player_count = dungeon_json["header"]["player_count"]
        dungeon_min_player_level = dungeon_json["header"]["level_min"]
        dungeon_max_player_level = dungeon_json["header"]["level_min"]

        room_strings = ["\n## Rooms"]
        for room in dungeon_rooms:
            room_markdown = ""
            room_header = f"### {room["name"]}" \
                f"\n{room["description"]}"

            traps = room["traps"]
            monsters = room["monsters"]

            trap_strings = ["\nThe room contains the following traps:"]
            for trap in traps:
                trap_strings.append(f"- {trap["quantity"]} {trap["name"]}s")
            trap_markdown = "\n".join(trap_strings)

            monster_strings = ["\nThe room contains the following monsters:"]
            raw_total_xp = 0
            for monster in monsters:
                monster_quantity = monster["quantity"]
                monster_strings.append(f"- {monster["quantity"]} {monster["name"]}s")
                raw_total_xp = raw_total_xp + (monster["xp"] * monster_quantity)
            monster_markdown = "\n".join(monster_strings)

            room_xp_strings = []
            multiplied_room_xp = self.multiply_room_xp(raw_total_xp, len(monsters))
            xp_per_player = multiplied_room_xp / dungeon_player_count
            encounter_rating_dict = self.get_room_rating(
                multiplied_room_xp,
                dungeon_player_count,
                dungeon_min_player_level,
                dungeon_max_player_level)
            room_xp_strings.append(
                f"\nTotal monster XP: raw: {raw_total_xp}xp / adjusted {multiplied_room_xp}xp / {xp_per_player} per player character")
            room_xp_strings.append("Room Ratings:")
            room_xp_strings.append(f"- Min Players: {encounter_rating_dict["min_rating"]}")
            room_xp_strings.append(f"- Mean Players: {encounter_rating_dict["mean_rating"]}")
            room_xp_strings.append(f"- Max Players: {encounter_rating_dict["max_rating"]}")
            room_xp_markdown = "\n".join(room_xp_strings)

            room_markdown_list = [
                room_markdown,
                room_header,
                trap_markdown,
                monster_markdown,
                room_xp_markdown]

            room_markdown = "\n".join(room_markdown_list)

            room_strings.append(room_markdown)
        joined_room_strings = "\n".join(room_strings)
        return joined_room_strings

    """
    Builds appendicies information: summary information about monsters and traps included within the dungeon
    """

    def build_appendicies_markdown(self, dungeon_json):
        monster_set = set()
        trap_set = set()
        rooms = dungeon_json["rooms"]
        appendicies = ["\n\n## Appendicies"]

        for room in rooms:
            traps = room["traps"]
            monsters = room["monsters"]

            for trap in traps:
                # Copy trap to set for later use in appendicies generation
                # Remove quantity to allow for accurate de-duping
                trap_copy = copy.deepcopy(trap)
                trap_copy.pop('quantity')

                # Frozen set ensures the trap is immutable and thus hashable, which allows
                # adding to set
                trap_set.add(frozenset(trap_copy.items()))

            for monster in monsters:
                # Copy monster to set for later use in appendicies generation
                # Remove quantity to allow for accurate de-duping
                monster_copy = copy.deepcopy(monster)
                monster_copy.pop('quantity')

                # Frozen set ensures the trap is immutable and thus hashable, which allows
                # adding to set
                monster_set.add(frozenset(monster_copy.items()))

        monster_appendix = ["\n### Monsters"]
        for monster in monster_set:
            unfrozen_monster = dict(monster)
            monster_appendix.append(f"- {unfrozen_monster["name"]} - {unfrozen_monster["xp"]}xp")
        monster_appendix_markdown = "\n".join(monster_appendix)
        appendicies.append(monster_appendix_markdown)

        trap_appendix = ["\n### Traps"]
        for trap in trap_set:
            unfrozen_trap = dict(trap)
            trap_appendix.append(f"- {unfrozen_trap["name"]}: {unfrozen_trap["effect"]}")
        trap_appendix_markdown = "\n".join(trap_appendix)
        appendicies.append(trap_appendix_markdown)

        appendicies_markdown = "\n".join(appendicies)

        return appendicies_markdown

    """
    Builds the markdown string to export
    """

    def build_markdown_string(self, dungeon_json):
        markdown_string = ""

        dungeon_header = self.build_dungeon_header(dungeon_json)
        joined_room_strings = self.build_room_markdown(dungeon_json)
        appendicies_markdown = self.build_appendicies_markdown(dungeon_json)

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

        response = HttpResponse(dungeon_markdown, content_type="text/markdown")
        response['Content-Disposition'] = f'attachment; filename="{dungeon_data["name"]}.md"'

        return response
