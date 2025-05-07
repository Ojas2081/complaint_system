from django.urls import path
from complaint_app.api.views import UserComplaintAV, ComplaintDetailAV,login_html,register_html,complaint_list_view,complaint_detail_id

urlpatterns = [
    path("", login_html, name="login_html"),
    path("signup/",register_html,name="register_html"),
    path("complaints/",UserComplaintAV.as_view(),name="user-complaints"),
    path("complaints/<int:pk>/",ComplaintDetailAV.as_view(),name="complaint-detail"),
    path("complaint-portal/",complaint_list_view,name="complaint-portal"),
    path("complaint-detail/",complaint_detail_id,name="complaint_detail")
]
