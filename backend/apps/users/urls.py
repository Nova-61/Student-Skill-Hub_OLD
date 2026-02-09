from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    MeView, 
    RegisterView, 
    CustomTokenObtainPairView,
    ResumeView,
    UserSearchView,
    UserDetailView,
    UserReviewsView,
    SpecialistsListView,
)

urlpatterns = [
    path("me/", MeView.as_view()),
    path("me/resume/", ResumeView.as_view()),
    path("register/", RegisterView.as_view()),
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("search/", UserSearchView.as_view()),
    path("specialists/", SpecialistsListView.as_view()),
    path("<int:user_id>/", UserDetailView.as_view()),
    path("<int:user_id>/reviews/", UserReviewsView.as_view()),
]
