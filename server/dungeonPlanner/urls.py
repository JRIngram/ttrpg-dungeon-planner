from django.urls import path

from . import views

urlpatterns = [
    path("monster", views.MonsterList.as_view(), name="index"),
    path("monster/<int:id>", views.MonsterSingle.as_view(), name="monster"),
    path("trap/<int:trap_id>", views.trap, name="trap"),
    path("room/<int:room_id>", views.room, name="room"),
    path("dungeon/<int:dungeon_id>", views.dungeon, name="dungeon")
]