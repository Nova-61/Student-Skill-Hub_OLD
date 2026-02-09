from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Dispute
from .serializers import DisputeSerializer
from apps.tasks.models import Task


class CreateDisputeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        task = Task.objects.get(id=request.data["task_id"])

        dispute = Dispute.objects.create(
            task=task,
            created_by=request.user,
            reason=request.data["reason"],
        )

        task.status = "disputed"
        task.save()

        return Response({"dispute_id": dispute.id})


class ModerateDisputeView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, dispute_id):
        dispute = Dispute.objects.get(id=dispute_id)

        dispute.status = request.data["status"]
        dispute.moderator_comment = request.data.get("comment", "")
        dispute.save()

        return Response({"status": dispute.status})


class DisputeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        disputes = Dispute.objects.all()
        serializer = DisputeSerializer(disputes, many=True)
        return Response(serializer.data)
