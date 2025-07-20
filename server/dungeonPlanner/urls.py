from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("/monster/<int:monster_id>", views.monster, name="monster"),
    path("trap/<int:trap_id>", views.trap, name="trap"),
    path("room/<int:room_id>", views.room, name="room"),
    path("dungeon/<int:dungeon_id>", views.dungeon, name="dungeon")
]