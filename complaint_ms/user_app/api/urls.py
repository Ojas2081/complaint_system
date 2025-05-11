from django.urls import path
from user_app.api.views import UserRegisterAV,UserLoginAV,UserLogout, UserDetailAV, UserUpdateAV
# from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("register/",UserRegisterAV.as_view(),name="user-register"),
    # path("login/",obtain_auth_token,name="user-login"),
    path("login/",UserLoginAV.as_view(),name="user-login"),
    path("logout/",UserLogout.as_view(),name="user-logout"),
    path("detail/",UserDetailAV.as_view(),name="cuurent_user-detail"),
    path("detail/<int:pk>/",UserUpdateAV.as_view(),name="specific-user-by-id"),
]