from django.urls import path
from .views import (
    TaskListCreateView, 
    TaskDetailView,
    TaskFilterView,
    TaskApplyView, 
    MyApplicationsView, 
    MyTasksView,
    MarkReadView, 
    TaskCancelApplicationView
)

urlpatterns = [
    path("", TaskListCreateView.as_view()),
    path("filter/", TaskFilterView.as_view()),
    path("my-tasks/", MyTasksView.as_view()),
    path("<int:task_id>/", TaskDetailView.as_view()),
    path("<int:task_id>/apply/", TaskApplyView.as_view()),
    path("<int:task_id>/apply/cancel/", TaskCancelApplicationView.as_view()),
    path("applied/", MyApplicationsView.as_view()),
    path("<int:task_id>/apply/mark_read/", MarkReadView.as_view()),
]
