from django.shortcuts import render

# # Create your views here.
# from rest_framework import status
# from api_app.api.serializers import TodoSerializer
# from rest_framework.decorators import api_view
# from api_app.models import Todo
# from rest_framework.response import Response
# from django.views.decorators.csrf import csrf_exempt

from rest_framework.views import APIView
from complaint_app.models import Complaint
from rest_framework.response import Response
from rest_framework import status
from .serializers import ComplaintSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from complaint_app.api.permissions import AdminOrReadOnly,ComplaintUserOrAdminOrReadonly
from django.db.models import Q
from django.contrib.auth import get_user_model

User = get_user_model()

# def index(request):
#     return render(request, 'complaint_app/register.html')

class UserComplaintAV(APIView):
    permission_classes = [AdminOrReadOnly]

    def get(self, request):
        if request.user.is_company_user:
            complaints = Complaint.objects.all()
        else:
            complaints = Complaint.objects.filter(user = request.user)
        serializer = ComplaintSerializer(complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        complaint_user = self.request.user
        # print("Current User", complaint_user)
        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=complaint_user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ComplaintDetailAV(APIView):

    permission_classes = [ComplaintUserOrAdminOrReadonly]

    def get(self, request, pk, *args, **kwargs):
        try:
            print(request.user)
            complaint = Complaint.objects.get(pk=pk)
            if not request.user.is_company_user:
                if complaint.user != request.user:
                    return Response({"error":"Un Authorized Person"}, status=status.HTTP_400_BAD_REQUEST)             
            serializer = ComplaintSerializer(complaint)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"error":"No data found for given id"}, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self,request,pk,*args,**kwargs):
        try:
            complaint = Complaint.objects.get(pk=pk)
            if not request.user.is_company_user:
                if complaint.user != request.user:
                    return Response({"error":"Un Authorized Person"}, status=status.HTTP_400_BAD_REQUEST) 
            serializer = ComplaintSerializer(complaint,data=request.data,partial=True)
            print(request.data)
            if serializer.is_valid():
                print("inside_valid")
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"error": "No data found for given id"}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request,pk,*args,**kwargs):
        try:
            complaint = Complaint.objects.get(pk=pk)
            if request.user.is_company_user or request.user == complaint.user:
                complaint.delete()
                return Response({"Message": "Data Deleted"}, status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "No data found for given id"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"error": "No data found for given id"}, status=status.HTTP_404_NOT_FOUND)
