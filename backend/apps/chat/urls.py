from django.urls import path
from .views import ChatStatusView

urlpatterns = [
    path("status/", ChatStatusView.as_view()),
]
