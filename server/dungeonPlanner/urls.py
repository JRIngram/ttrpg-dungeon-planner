"""
Defines pairing of urls to views
"""
from django.urls import path

from . import views

urlpatterns = [
    path("monster", views.MonsterList.as_view(), name="index"),
    path("monster/<int:id>", views.MonsterSingle.as_view(), name="monster"),
    path("trap/<int:trap_id>", views.trap_single, name="trap"),
    path("room/<int:room_id>", views.room_single, name="room"),
    path("dungeon/<int:dungeon_id>", views.dungeon_single, name="dungeon")
]
