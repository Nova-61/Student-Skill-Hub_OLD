from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from .models import Task, Application, TaskAttachment
from .serializers import TaskSerializer, ApplicationSerializer
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Q


class TaskListCreateView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        tasks = Task.objects.all().order_by('-created_at')
        
        # фильтр по хозяину задачи
        owner_id = request.query_params.get('owner_id', '')
        if owner_id:
            tasks = tasks.filter(owner_id=owner_id)
        
        # фильтр по городу
        city = request.query_params.get('city', '')
        if city:
            tasks = tasks.filter(city__icontains=city)
        
        # фильтр по статусу
        task_status = request.query_params.get('status', '')
        if task_status:
            tasks = tasks.filter(status=task_status)
        
        # фильтр по важности
        importance = request.query_params.get('importance', '')
        if importance:
            tasks = tasks.filter(importance=importance)
        
        # фильтр по диапазону цены
        price_min = request.query_params.get('price_min', '')
        price_max = request.query_params.get('price_max', '')
        if price_min:
            tasks = tasks.filter(price__gte=price_min)
        if price_max:
            tasks = tasks.filter(price__lte=price_max)
        
        # поиск по названию, описанию и требуемым навыкам
        search = request.query_params.get('search', '')
        if search:
            tasks = tasks.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(skills_required__icontains=search)
            )
        
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Нужна авторизация"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save(owner=request.user)
            # загружаем файлы если пришли
            files = request.FILES.getlist("files")
            created = []
            for f in files:
                att = TaskAttachment.objects.create(task=task, file=f)
                created.append({"id": att.id, "url": att.file.url})
            data = serializer.data
            if created:
                data = dict(serializer.data)
                data["attachments"] = created
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        if task.owner != request.user:
            return Response(
                {"error": "Вы можете редактировать только свои задачи"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            task = serializer.save()
            # загружаем новые файлы если пришли
            files = request.FILES.getlist("files")
            created = []
            for f in files:
                att = TaskAttachment.objects.create(task=task, file=f)
                created.append({"id": att.id, "url": att.file.url})
            data = serializer.data
            if created:
                data = dict(serializer.data)
                data["attachments"] = created
            return Response(data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        if task.owner != request.user:
            return Response(
                {"error": "Вы можете удалять только свои задачи"},
                status=status.HTTP_403_FORBIDDEN
            )
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskFilesView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        if task.owner != request.user:
            return Response({"error": "Только владелец может добавлять файлы"}, status=status.HTTP_403_FORBIDDEN)
        files = request.FILES.getlist("files")
        created = []
        for f in files:
            att = TaskAttachment.objects.create(task=task, file=f)
            created.append({"id": att.id, "url": att.file.url})
        return Response({"created": created}, status=status.HTTP_201_CREATED)


class TaskFileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, task_id, file_id):
        task = get_object_or_404(Task, id=task_id)
        att = get_object_or_404(TaskAttachment, id=file_id, task=task)
        if task.owner != request.user:
            return Response({"error": "Только владелец может удалять файлы"}, status=status.HTTP_403_FORBIDDEN)
        att.file.delete(save=False)
        att.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskFilterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Фильтруем задачи по различным параметрам"""
        tasks = Task.objects.all()
        
        # фильтр по городу
        city = request.query_params.get('city', '')
        if city:
            tasks = tasks.filter(city__icontains=city)
        
        # фильтр по статусу
        task_status = request.query_params.get('status', '')
        if task_status:
            tasks = tasks.filter(status=task_status)
        
        # фильтр по важности
        importance = request.query_params.get('importance', '')
        if importance:
            tasks = tasks.filter(importance=importance)
        
        # фильтр по диапазону цены
        price_min = request.query_params.get('price_min', '')
        price_max = request.query_params.get('price_max', '')
        if price_min:
            tasks = tasks.filter(price__gte=price_min)
        if price_max:
            tasks = tasks.filter(price__lte=price_max)
        
        # поиск по названию, описанию или требуемым навыком
        search = request.query_params.get('search', '')
        if search:
            tasks = tasks.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(skills_required__icontains=search)
            )
        
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TaskApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        cover_letter = request.data.get("cover_letter", "")
        app, created = Application.objects.update_or_create(
            task=task, user=request.user,
            defaults={"cover_letter": cover_letter, "status": "active"}
        )
        return Response({"task_id": task.id, "applied": created}, status=201 if created else 200)


class TaskCancelApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        app = get_object_or_404(Application, task=task, user=request.user)
        app.status = "withdrawn"
        app.save()
        # Send notification via WebSocket to task owner
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"task_{task_id}_notifications",
                {
                    "type": "application_withdrawn",
                    "user_id": request.user.id,
                    "user_email": request.user.email,
                }
            )
        except Exception:
            pass
        return Response({"cancelled": True})


class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        apps = Application.objects.filter(user=request.user).select_related("task")
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)


class MyTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(owner=request.user).order_by('-created_at')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class MarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        app = get_object_or_404(Application, task=task, user=request.user)
        app.last_read_at = timezone.now()
        app.save()
        return Response({"marked": True})
