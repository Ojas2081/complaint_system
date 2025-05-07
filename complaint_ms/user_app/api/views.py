from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegisterSerializer,UserLoginSerializer
from rest_framework.authtoken.models import Token

from complaint_app.api.permissions import ComplaintUserOrAdminOrReadonly

from django.contrib.auth import get_user_model

User = get_user_model()

class UserDetailAV(APIView):
    permission_classes =[ComplaintUserOrAdminOrReadonly]
    def get(self,request,*args,**kwargs):
        # if self.request.user.is_company_user:
        #     users = User.objects.all()
        #     many = True
        # else:
        # try:
        #     user = User.objects.get(email=request.user.email)
        #     many = False
        # except:
        #     return Response({"error":"Not Authorized"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserRegisterSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)

class UserRegisterAV(APIView):

    # def get(self,request,*args,**kwargs):
    #     if self.request.user.is_company_user:
    #         users = User.objects.all()
    #         many = True
    #     else:
    #         try:
    #             users = User.objects.get(email=request.user.email)
    #             many = False
    #         except:
    #             return Response({"error":"Not Authorized"}, status=status.HTTP_400_BAD_REQUEST)
    #     serializer = UserRegisterSerializer(users, many=many)
    #     return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self, request,*args,**kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            reg_user = serializer.save()
            data = {}
            data['Message'] = 'User Registered Successfully'
            data['email'] = request.data['email']
            token = Token.objects.get(user = reg_user).key
            data['token'] = token


            return Response({"Response":data},status=status.HTTP_201_CREATED)
        data = serializer.errors
        return Response(data,status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginAV(APIView):

    def post(self,request,*args,**kwargs):
        serializer = UserLoginSerializer(data=self.request.data)
        data = {}
        if serializer.is_valid():
            # print(serializer)
            login_user = User.objects.filter(email=self.request.data['email']).first()
            print("Login User",login_user)
            
            token = Token.objects.get_or_create(user=login_user)[0].key
            data['token'] = token
            return Response(data,status=status.HTTP_200_OK)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class UserLogout(APIView):

    def post(self,request,*args,**kwargs):
        request.user.auth_token.delete()
        print("Auth token deleted")
        return Response({"success":"User logged out"})

