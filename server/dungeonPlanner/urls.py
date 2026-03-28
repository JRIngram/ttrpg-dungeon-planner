"""
Defines pairing of urls to views
"""
from django.urls import path

from . import views

urlpatterns = [
    path("dungeon", views.DungeonList.as_view(), name="dungeon"),
    path("dungeon/<int:id>", views.DungeonSingle.as_view(), name="dungeon"),
    path("monster", views.MonsterList.as_view(), name="monster"),
    path("monster/<int:id>", views.MonsterSingle.as_view(), name="monster"),
    path("room", views.RoomList.as_view(), name="room"),
    path("room/<int:id>", views.RoomSingle.as_view(), name="room"),
    path("trap", views.TrapList.as_view(), name="trap"),
    path("trap/<int:id>", views.TrapSingle.as_view(), name="trap"),
    path(
        "encounterMultiplierConfigRow", 
        views.EncounterMultiplierConfigRowList.as_view(), 
        name="encounterMultiplierConfig"
    ),
    path(
        "encounterMultiplierConfigRow/<int:id>",
        views.EncounterMultiplierConfigRowSingle.as_view(),
        name="encounterMultiplierConfig"
    )
]
