from django.contrib import admin
from .models import Escrow


@admin.register(Escrow)
class EscrowAdmin(admin.ModelAdmin):
    list_display = ("id", "task", "amount", "status", "payer", "payee")
    list_filter = ("status",)
