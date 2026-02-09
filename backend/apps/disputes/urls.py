from django.urls import path
from .views import CreateDisputeView, ModerateDisputeView, DisputeListView

urlpatterns = [
    path("", DisputeListView.as_view()),
    path("create/", CreateDisputeView.as_view()),
    path("moderate/<int:dispute_id>/", ModerateDisputeView.as_view()),
]
