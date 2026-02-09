from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    bio = models.TextField(blank=True, default="")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Resume(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='resume')
    title = models.CharField(max_length=255, blank=True, default="")
    summary = models.TextField(blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    location = models.CharField(max_length=255, blank=True, default="")
    skills = models.TextField(blank=True, default="")  # Comma-separated skills
    experience = models.TextField(blank=True, default="")
    education = models.TextField(blank=True, default="")
    portfolio_url = models.URLField(blank=True, default="")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume of {self.user.email}"
