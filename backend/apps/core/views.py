from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from apps.tasks.models import Task
from apps.reviews.models import Review


class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_tasks = Task.objects.count()
        user_tasks = Task.objects.filter(owner=request.user).count()
        avg_rating = Review.objects.filter(reviewed_user=request.user).aggregate(
            avg=models.Avg('rating')
        )['avg'] or 0
        
        return Response({
            "total_tasks": total_tasks,
            "user_tasks": user_tasks,
            "avg_rating": float(avg_rating),
        })
