from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "task", "sender", "created_at")
    search_fields = ("text",)
