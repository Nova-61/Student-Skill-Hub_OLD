from django.db import models
from django.conf import settings
from apps.tasks.models import Task

# Create your models here.

class Message(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["created_at"]