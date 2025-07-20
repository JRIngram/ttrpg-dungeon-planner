from django.contrib import admin

# Register your models here.
from .models import Dungeon, Room, Monster, Trap

admin.site.register(Dungeon)
admin.site.register(Room)
admin.site.register(Monster)
admin.site.register(Trap)