from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer
from apps.tasks.models import Task


class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        task_id = request.data.get("task_id")
        rating = request.data.get("rating")
        comment = request.data.get("comment", "")
        
        task = Task.objects.get(id=task_id)
        
        if rating < 1 or rating > 5:
            return Response(
                {"error": "Рейтинг должен быть от 1 до 5"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if review already exists
        existing_review = Review.objects.filter(
            task=task,
            reviewer=request.user
        ).first()
        
        if existing_review:
            # Update existing review
            existing_review.rating = rating
            existing_review.comment = comment
            existing_review.save()
            serializer = ReviewSerializer(existing_review)
            return Response(serializer.data)
        
        # Create new review
        review = Review.objects.create(
            task=task,
            reviewer=request.user,
            reviewed_user=task.owner,
            rating=rating,
            comment=comment,
        )

        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, review_id):
        """Get a specific review"""
        review = Review.objects.get(id=review_id)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    def delete(self, request, review_id):
        """Delete a review (only by reviewer)"""
        review = Review.objects.get(id=review_id)
        if review.reviewer != request.user:
            return Response(
                {"error": "Вы можете удалить только свой отзыв"},
                status=status.HTTP_403_FORBIDDEN
            )
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskReviewsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        """Get all reviews for a specific task"""
        reviews = Review.objects.filter(task_id=task_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
