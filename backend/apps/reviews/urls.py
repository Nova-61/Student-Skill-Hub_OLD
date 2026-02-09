from django.urls import path
from .views import (
    CreateReviewView, 
    ReviewListView,
    ReviewDetailView,
    TaskReviewsView
)

urlpatterns = [
    path("", ReviewListView.as_view()),
    path("create/", CreateReviewView.as_view()),
    path("<int:review_id>/", ReviewDetailView.as_view()),
    path("task/<int:task_id>/", TaskReviewsView.as_view()),
]
