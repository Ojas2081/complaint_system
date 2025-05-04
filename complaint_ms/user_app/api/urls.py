from django.urls import path
from user_app.api.views import UserRegisterAV,UserLoginAV,UserLogout
# from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("register/",UserRegisterAV.as_view(),name="user-register"),
    # path("login/",obtain_auth_token,name="user-login"),
    path("login/",UserLoginAV.as_view(),name="user-login"),
    path("logout/",UserLogout.as_view(),name="user-logout"),
]