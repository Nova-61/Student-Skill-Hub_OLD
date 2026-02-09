import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from datetime import datetime

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # expect task_id in url route kwargs
        self.task_id = self.scope.get("url_route", {}).get("kwargs", {}).get("task_id")
        if not self.task_id:
            await self.close()
            return

        # check permission: allow if user is task owner or has an application
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close()
            return

        allowed = await sync_to_async(self._check_allowed)(user, int(self.task_id))
        if not allowed:
            await self.close()
            return

        self.room_group_name = f"task_{self.task_id}"
        self.notifications_group = f"task_{self.task_id}_notifications"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.channel_layer.group_add(self.notifications_group, self.channel_name)
        await self.accept()

    def _check_allowed(self, user, task_id):
        from apps.tasks.models import Task, Application
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return False
        if task.owner_id == user.id:
            return True
        return Application.objects.filter(task_id=task_id, user=user, status="active").exists()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        if hasattr(self, "notifications_group"):
            await self.channel_layer.group_discard(self.notifications_group, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        sender = self.scope["user"].email if self.scope["user"].is_authenticated else "Anonymous"

        # save message
        await sync_to_async(self._save_message)(int(self.task_id), self.scope["user"].id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender,
                "timestamp": datetime.now().isoformat(),
            }
        )

    def _save_message(self, task_id, user_id, text):
        from apps.tasks.models import Task
        from .models import Message
        try:
            task = Task.objects.get(id=task_id)
            user = User.objects.get(id=user_id)
            Message.objects.create(task=task, sender=user, text=text)
        except Exception:
            pass

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message": event["message"],
            "sender": event["sender"],
            "timestamp": event.get("timestamp"),
        }))

    async def application_withdrawn(self, event):
        await self.send(text_data=json.dumps({
            "type": "notification",
            "event": "application_withdrawn",
            "user_id": event["user_id"],
            "user_email": event["user_email"],
        }))

    async def application_new(self, event):
        await self.send(text_data=json.dumps({
            "type": "notification",
            "event": "application_new",
            "user_id": event["user_id"],
            "user_email": event["user_email"],
        }))


