from django.conf import settings
from django.db import models


class Task(models.Model):
    STATUS_CHOICES = (
        ("open", "Открыта"),
        ("in_progress", "В работе"),
        ("completed", "Завершена"),
        ("disputed", "Отменена"),
    )
    
    IMPORTANCE_CHOICES = (
        ("low", "Низкая"),
        ("medium", "Средняя"),
        ("high", "Высокая"),
        ("critical", "Критическая"),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="open"
    )
    city = models.CharField(max_length=100, blank=True, default="")
    deadline = models.DateTimeField(null=True, blank=True)
    importance = models.CharField(
        max_length=20, choices=IMPORTANCE_CHOICES, default="medium"
    )
    skills_required = models.CharField(max_length=500, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Application(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("withdrawn", "Withdrawn"),
    )

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="applications")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="applications")
    cover_letter = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    last_read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("task", "user")

    def __str__(self):
        return f"Application {self.user_id} -> {self.task_id} ({self.status})"


class TaskAttachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="task_files/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment {self.id} for Task {self.task_id}"
