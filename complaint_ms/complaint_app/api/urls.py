from django.urls import path
from complaint_app.api.views import UserComplaintAV, ComplaintDetailAV,ComplaintDashboard,login_html,register_html,complaint_list_view,complaint_detail_id,edit_user_list,edit_user,company_dashboard

urlpatterns = [
    path("", login_html, name="login_html"),
    path("signup/",register_html,name="register_html"),
    path("complaints/",UserComplaintAV.as_view(),name="user-complaints"),
    path("complaints/<int:pk>/",ComplaintDetailAV.as_view(),name="complaint-detail"),
    path("complaint-portal/",complaint_list_view,name="complaint-portal"),
    path("complaint-detail/",complaint_detail_id,name="complaint_detail"),
    path("edit-users-list/",edit_user_list, name="edit_user_list"),
    path("edit-profile/",edit_user,name="edit_user"),
    path("company-user-view/",company_dashboard,name="company_dashboard"),
    path("dashboard-metrics/",ComplaintDashboard.as_view(),name="dashboard_metrics"),
]
