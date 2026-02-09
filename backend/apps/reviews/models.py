from django.conf import settings
from django.db import models
from apps.tasks.models import Task


class Review(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews_written",
    )
    reviewed_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews_received",
    )

    rating = models.PositiveSmallIntegerField()  # 1-5
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ("task", "reviewer", "reviewed_user")

    def __str__(self):
        return f"Review {self.rating}/5 for task {self.task_id}"
