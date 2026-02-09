from rest_framework import serializers
from .models import Escrow


class EscrowSerializer(serializers.ModelSerializer):
    payer = serializers.StringRelatedField()
    payee = serializers.StringRelatedField()

    class Meta:
        model = Escrow
        fields = ["id", "task", "payer", "payee", "amount", "status", "created_at"]
        read_only_fields = ["id", "created_at"]
