from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.StringRelatedField()
    reviewed_user = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = ["id", "task", "reviewer", "reviewed_user", "rating", "comment", "created_at"]
        read_only_fields = ["id", "reviewer", "created_at"]
