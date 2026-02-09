from rest_framework import serializers
from .models import Task, Application
from .models import TaskAttachment


class TaskSerializer(serializers.ModelSerializer):
    # берем айди и имя хозяина задачи
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    # получаем все файлы для задачи
    attachments = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id", "owner_id", "owner_name", "title", "description", "price", "status", 
            "city", "deadline", "importance", "skills_required", 
            "created_at", "updated_at", "attachments"
        ]
        read_only_fields = ["id", "owner_id", "owner_name", "created_at", "updated_at"]

    def get_attachments(self, obj):
        # список всех файлов к задаче
        try:
            return [{"id": a.id, "url": a.file.url} for a in obj.attachments.all()]
        except Exception:
            return []


class ApplicationSerializer(serializers.ModelSerializer):
    # пользователь который подал заявку
    user = serializers.StringRelatedField()
    # полная информация о задаче встроена в результат
    id = serializers.SerializerMethodField()
    title = serializers.CharField(source='task.title', read_only=True)
    status = serializers.CharField(source='task.status', read_only=True)
    price = serializers.IntegerField(source='task.price', read_only=True)
    city = serializers.CharField(source='task.city', read_only=True)
    task_id = serializers.IntegerField(source='task.id', read_only=True)
    task_detail = TaskSerializer(source='task', read_only=True)

    class Meta:
        model = Application
        fields = ["id", "task_id", "task_detail", "title", "status", "price", "city", "user", "cover_letter", "created_at"]
        read_only_fields = ["id", "user", "created_at"]
    
    def get_id(self, obj):
        # Возвращаем id как id задачи для совместимости с фронтендом 
        return obj.task.id

