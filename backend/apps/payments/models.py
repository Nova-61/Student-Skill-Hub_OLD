from django.conf import settings
from django.db import models
from apps.tasks.models import Task


class Escrow(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("funded", "Funded"),
        ("released", "Released"),
        ("refunded", "Refunded"),
        ("disputed", "Disputed"),
    )

    task = models.OneToOneField(Task, on_delete=models.CASCADE)
    payer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="escrows_paid",
    )
    payee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="escrows_received",
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Escrow #{self.id} - {self.status}"
