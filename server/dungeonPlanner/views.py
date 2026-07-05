"""
Defines the views for the dungeon planner app
"""
import copy
from django.http import HttpResponse, JsonResponse
from rest_framework import generics

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


class EncounterMultiplierConfigRowSingle(generics.RetrieveUpdateDestroyAPIView):
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


class EncounterRatingConfigRowSingle(generics.RetrieveUpdateDestroyAPIView):
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


    def multiply_room_xp(self, total_xp, monster_count):
        """
        Multiplies the XP of a room based on total xp, monster count
        and user generated encounter multiplier configs
        """
        multiplier_configs = EncounterMultiplierConfigRow.objects.filter(
            min__lte=monster_count,
            max__gte=monster_count
        )

        if multiplier_configs.count() == 0:
            return total_xp
        if multiplier_configs.count() != 1:
            raise LookupError(
                "Multiple matching configs."
                " This suggests an error when creating the configs."
            )
        first_config = multiplier_configs.first()
        return total_xp * first_config.multiplier

    def get_room_rating(self, adjusted_xp, player_count, min_player_level, max_player_level):
        """
        Provides a room rating based on passed XP,
        min_player_level, max_player_level and mean players
        """
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
        """
        Returns xp divided by player count
        """
        return xp / player_count

    def get_rating_from_config(self, encounter_xp, player_count, rating_config) -> str:
        """
        Calculates which rating to return from an EncounterRatingConfig based on passed xp

        Used as part of get_room_rating
        """
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
        if easy <= xp_per_player < medium:
            return "Easy"
        if  medium <= xp_per_player < hard:
            return "Medium"
        if hard <= xp_per_player < extreme:
            return "Hard"
        if xp_per_player >= extreme:
            return "Extreme"

        raise LookupError(
            "No matching encounter config. " \
            "This suggests an error when creating the configs."
        )

    def build_dungeon_header(self, dungeon_json):
        """
        Builds the headeer section of the markdown. Summary information about the dungeon.
        """
        dungeon_header = dungeon_json["header"]
        dungeon_header_markdown = f"# {dungeon_header["name"]}" \
            "\n## Summary" \
            f"\n{dungeon_header["summary"]}" \
            f"\nFor {
            dungeon_header["player_count"]} player characters levels {
            dungeon_header["level_min"]} - {
            dungeon_header["level_max"]}.\n"
        return dungeon_header_markdown

    def build_trap_markdown(self, room_traps):
        """
        Builds a room's trap markdown from passed room_traps
        """
        trap_strings = ["\nThe room contains the following traps:"]
        for trap in room_traps:
            trap_strings.append(f"- {trap["quantity"]} {trap["name"]}s")
        trap_markdown = "\n".join(trap_strings)
        return trap_markdown

    def build_room_markdown(self, dungeon_json):
        """
        Builds the markdown for the rooms of the dungeon
        """
        dungeon_rooms = dungeon_json["rooms"]
        dungeon_header = dungeon_json["header"]

        room_strings = ["\n## Rooms"]

        for room in dungeon_rooms:
            room_markdown = ""
            room_header = f"### {room["name"]}" \
                f"\n{room["description"]}"

            monsters = room["monsters"]

            trap_markdown = self.build_trap_markdown(room["traps"])
            monster_markdown = self.build_monster_markdown(monsters)
            room_xp_markdown = self.build_room_xp_markdown(dungeon_header, monsters)

            room_markdown_list = [
                room_markdown,
                room_header,
                trap_markdown,
                monster_markdown,
                room_xp_markdown
            ]

            room_markdown = "\n".join(room_markdown_list)

            room_strings.append(room_markdown)
        joined_room_strings = "\n".join(room_strings)
        return joined_room_strings

    def build_monster_markdown(self, monsters) -> str:
        """
        Builds a room's monster markdown from passed room_monsters
        """
        monster_strings = ["\nThe room contains the following monsters:"]
        for monster in monsters:
            monster_strings.append(f"- {monster["quantity"]} {monster["name"]}s")
        monster_markdown = "\n".join(monster_strings)
        return monster_markdown

    def get_room_total_raw_xp(self, monsters) -> float:
        """
        Gets a room's total, adjusted, xp from the passed monster data
        """
        raw_total_xp = 0
        for monster in monsters:
            monster_quantity = monster["quantity"]
            raw_total_xp = raw_total_xp + (monster["xp"] * monster_quantity)
        return raw_total_xp

    def build_room_xp_markdown(self, dungeon_header, monsters):
        """
        Builds markdown for information on a room's XP values
        """
        raw_total_xp = self.get_room_total_raw_xp(monsters)
        room_xp_strings = []
        multiplied_room_xp = self.multiply_room_xp(raw_total_xp, len(monsters))
        encounter_rating_dict = self.get_room_rating(
                multiplied_room_xp,
                dungeon_header["player_count"],
                dungeon_header["level_min"],
                dungeon_header["level_max"])
        xp_per_player = self.get_xp_per_player(multiplied_room_xp, dungeon_header["player_count"])
        room_xp_strings.append(
                f"\nTotal monster XP: raw: {raw_total_xp}xp /" \
                f"adjusted {multiplied_room_xp}xp / {xp_per_player} per player character")
        room_xp_strings.append("Room Ratings:")
        room_xp_strings.append(f"- Min Players: {encounter_rating_dict["min_rating"]}")
        room_xp_strings.append(f"- Mean Players: {encounter_rating_dict["mean_rating"]}")
        room_xp_strings.append(f"- Max Players: {encounter_rating_dict["max_rating"]}")
        room_xp_markdown = "\n".join(room_xp_strings)
        return room_xp_markdown

    def build_deduped_set_for_room_data(self, room_data, source_key, key_to_delete: str):
        """
        Creates a set from a source key in the room_data
        Deletes key from source data to enable accurate deduping
        """
        new_set = set()
        for room in room_data:
            list_data_to_dedupe = room[source_key]

            for item in list_data_to_dedupe:
                self.add_copy_to_set(item, new_set, key_to_delete)
        return new_set


    def add_copy_to_set(self, item_to_copy: dict, set_to_add: set, key_to_delete: str):
        """
        Adds a copy to set and removes passed key_to_delete
        to allow for accurate deduping

        Frozen set ensures the item is immutable 
        and thus hashable, which allowsadding to set
        """
        copied_item = copy.deepcopy(item_to_copy)
        copied_item.pop(key_to_delete)
        set_to_add.add(frozenset(copied_item.items()))

    def build_appendicies_markdown(self, dungeon_json):
        """
        Builds appendicies information: summary information about 
        monsters and traps included within the dungeon
        """
        rooms = dungeon_json["rooms"]
        monster_set = self.build_deduped_set_for_room_data(rooms, "monsters", "quantity")
        trap_set = self.build_deduped_set_for_room_data(rooms, "traps", "quantity")
        appendicies = ["\n\n## Appendicies"]
        print("monster_set", monster_set)

        # for room in rooms:
        #     traps = room["traps"]
        #     monsters = room["monsters"]

        #     for trap in traps:
        #         self.add_copy_to_set(trap, trap_set, 'quantity')

        #     for monster in monsters:
        #         self.add_copy_to_set(monster, monster_set, 'quantity')

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

    def build_markdown_string(self, dungeon_json):
        """
        Builds the markdown string to export
        """
        markdown_string = ""

        dungeon_header = self.build_dungeon_header(dungeon_json)
        joined_room_strings = self.build_room_markdown(dungeon_json)
        appendicies_markdown = self.build_appendicies_markdown(dungeon_json)

        markdown_string = (markdown_string + dungeon_header
                           + joined_room_strings + appendicies_markdown)

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
