from rest_framework import serializers
from .models import Dispute


class DisputeSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()

    class Meta:
        model = Dispute
        fields = ["id", "task", "created_by", "reason", "status", "moderator_comment", "created_at"]
        read_only_fields = ["id", "created_at"]
