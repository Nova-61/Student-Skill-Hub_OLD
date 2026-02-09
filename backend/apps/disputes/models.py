from django.conf import settings
from django.db import models
from apps.tasks.models import Task


class Dispute(models.Model):
    STATUS_CHOICES = (
        ("open", "Open"),
        ("in_review", "In Review"),
        ("resolved", "Resolved"),
        ("rejected", "Rejected"),
    )

    task = models.OneToOneField(Task, on_delete=models.CASCADE)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="disputes_created",
    )

    reason = models.TextField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="open"
    )

    moderator_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dispute #{self.id} ({self.status})"
