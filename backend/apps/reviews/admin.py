from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "task", "rating", "reviewer", "reviewed_user")
    list_filter = ("rating",)
