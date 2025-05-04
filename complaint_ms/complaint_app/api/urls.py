from django.urls import path
from complaint_app.api.views import UserComplaintAV, ComplaintDetailAV

urlpatterns = [
    # path("", index, name="index"),
    path("complaints/",UserComplaintAV.as_view(),name="user-complaints"),
    path("complaints/<int:pk>/",ComplaintDetailAV.as_view(),name="complaint-detail"),
]
