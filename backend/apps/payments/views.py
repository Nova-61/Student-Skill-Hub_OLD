from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Escrow
from .serializers import EscrowSerializer
from apps.tasks.models import Task


class CreateEscrowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        task = Task.objects.get(id=request.data["task_id"])

        escrow = Escrow.objects.create(
            task=task,
            payer=request.user,
            payee=task.owner,
            amount=task.price,
        )

        task.status = "in_progress"
        task.save()

        return Response({
            "escrow_id": escrow.id,
            "status": escrow.status,
        })


class EscrowListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        escrows = Escrow.objects.filter(payer=request.user) | Escrow.objects.filter(payee=request.user)
        serializer = EscrowSerializer(escrows, many=True)
        return Response(serializer.data)


class EscrowFundView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, escrow_id):
        escrow = Escrow.objects.get(id=escrow_id)
        if escrow.payer != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        escrow.status = "funded"
        escrow.save()
        serializer = EscrowSerializer(escrow)
        return Response(serializer.data)


class EscrowReleaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, escrow_id):
        escrow = Escrow.objects.get(id=escrow_id)
        if escrow.payer != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        escrow.status = "released"
        escrow.save()
        return Response({"status": "released"})
