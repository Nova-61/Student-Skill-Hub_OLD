from django.contrib import admin
from .models import Dispute


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ("id", "task", "status", "created_by", "created_at")
    list_filter = ("status",)
    search_fields = ("reason", "moderator_comment")
