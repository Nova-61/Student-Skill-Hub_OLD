from django.urls import path
from .views import (
    CreateEscrowView,
    EscrowListView,
    EscrowFundView,
    EscrowReleaseView,
)

urlpatterns = [
    path("", EscrowListView.as_view()),
    path("create/", CreateEscrowView.as_view()),
    path("<int:escrow_id>/fund/", EscrowFundView.as_view()),
    path("<int:escrow_id>/release/", EscrowReleaseView.as_view()),
]
