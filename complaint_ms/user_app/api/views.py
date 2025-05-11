from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegisterSerializer,UserLoginSerializer,UserUpdateSerializer
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from complaint_app.api.permissions import ComplaintUserOrAdminOrReadonly
from django.shortcuts import get_object_or_404

from django.core.mail import send_mail


from django.contrib.auth import get_user_model

User = get_user_model()

def email_send(email_from,email_to,subject,html_message = None,text=None):
    if html_message:
        email = EmailMessage(subject, body=html_message, from_email=email_from, to=[email_to])
        email.content_subtype = "html"
        email.send()
        print("Email Sent successfully !!")
    else:
        email = EmailMessage(subject, body=text, from_email=email_from, to=[email_to])
        email.send()
        print("Email Sent successfully !!")


class UserDetailAV(APIView):
    permission_classes =[ComplaintUserOrAdminOrReadonly]
    def get(self,request,*args,**kwargs):
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
    

    def get(self,request,*args,**kwargs):
            if self.request.user.is_company_user:
                users = User.objects.all()
                many = True
            else:
                try:
                    users = User.objects.get(email=request.user.email)
                    many = False
                except:
                    return Response({"error":"Not Authorized"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = UserRegisterSerializer(users, many=many)
            return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self, request,*args,**kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            reg_user = serializer.save()
            data = {}
            data['Message'] = 'User Registered Successfully'
            data['email'] = request.data['email']
            token = Token.objects.get(user = reg_user).key
            data['token'] = token
            subject = "Welcome Mail to Our New User"
            html_message = render_to_string('complaint_app/email.html', {'user_name': f'{reg_user.first_name} {reg_user.last_name}','year':2025})


            email_send(settings.EMAIL_HOST_USER,reg_user.email,subject,html_message)
            print("Email Sent successfully !!")

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
    

class UserUpdateAV(APIView):

    permission_classes =[ComplaintUserOrAdminOrReadonly]

    def get(self, request,pk,*args,**kwargs):
        user = User.objects.filter(pk=pk).first()
        if user:
            serializer = UserRegisterSerializer(user)
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    # def patch(self, request,*args,**kwargs):
    #     serializer = UserUpdateSerializer(data=request.data, partial = True)
    #     if serializer.is_valid():
    #         reg_user = serializer.save()
    #         data = {}

    #         data['Message'] = 'User Updated Successfully'
    #         return Response({"Response":data},status=status.HTTP_201_CREATED)
    #     data = serializer.errors
    #     return Response(data,status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, *args, **kwargs):
        user = get_object_or_404(User, pk=pk)
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)  # <- instance passed here
        if serializer.is_valid():
            serializer.save()
            return Response({"success": "User updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

