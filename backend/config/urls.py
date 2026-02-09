from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    # API Schema
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # Apps
    path("api/tasks/", include("apps.tasks.urls")),
    path("api/users/", include("apps.users.urls")),
    path("api/core/", include("apps.core.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/reviews/", include("apps.reviews.urls")),
    path("api/disputes/", include("apps.disputes.urls")),
    path("api/chat/", include("apps.chat.urls")),
]
