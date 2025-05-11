from django.shortcuts import render

from rest_framework.views import APIView
from complaint_app.models import Complaint
from rest_framework.response import Response
from rest_framework import status
from .serializers import ComplaintSerializer, DashboardMetricsSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from complaint_app.api.permissions import AdminOrReadOnly,ComplaintUserOrAdminOrReadonly
from django.db.models import Q
from collections import Counter
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings

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

def login_html(request):
    return render(request, 'complaint_app/login.html')

def register_html(request):
    return render(request,'complaint_app/register.html')

def complaint_list_view(request):
    return render(request, 'complaint_app/complaints_list.html')

def complaint_detail_id(request):
    return render(request,'complaint_app/complaint_detail.html')

def edit_user_list(request):
    return render(request, 'complaint_app/edit_user_list.html')

def edit_user(request):
    return render(request, 'complaint_app/edit_profile.html')

def company_dashboard(request):
    return render(request,'complaint_app/company_dasboard.html')

class UserComplaintAV(APIView):
    permission_classes = [AdminOrReadOnly]

    def get(self, request):
        if request.user.is_company_user:
            print("Inside")
            user_name = self.request.query_params.get('u')
            status_ = self.request.query_params.get('s')
            category = self.request.query_params.get('c')
            complaints = Complaint.objects.all()
            
            if user_name:
                print("username",user_name)
                complaints = Complaint.objects.filter(Q(user__first_name__icontains = user_name) | Q(user__last_name__icontains = user_name))
            if status_:
                print("status",status_)
                # complaints = Complaint.objects.filter(status = self.request.query_params.get('s'))
                complaints = complaints.filter(status__iexact=status_)
            if category:
                print("category",category)
                complaints = complaints.filter(complaint_type__iexact=category)
        else:
            if self.request.query_params.get('s'):
                print("request here")
                complaints = Complaint.objects.filter(Q(user = request.user) & Q(status = self.request.query_params.get('s')))
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
                if request.data.get('status',None) == "Resolved":
                    subject = "Your Complaint Status has been updated"
                    context = {
                        'user_name': f'{complaint.user.first_name} {complaint.user.last_name}',
                        'complaint_type': complaint.complaint_type,
                        'resolution_msg': complaint.resolution_msg,
                        'year': 2025
                    }
                    html_message = render_to_string('complaint_app/resolved.html', context)
                    email_send(settings.EMAIL_HOST_USER,complaint.user.email,subject,html_message)
                    print("Email Sent successfully !!")

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
        
class ComplaintDashboard(APIView):

    permission_classes = [ComplaintUserOrAdminOrReadonly]

    def get(self, request):
        if not request.user.is_company_user:
            return Response({"error": "Unauthorized"}, status=403)

        complaints = Complaint.objects.all()
        status_count = dict(Counter(complaints.values_list('status', flat=True)))
        category_count = dict(Counter(complaints.values_list('complaint_type', flat=True)))
        resolved = status_count.get('Resolved', 0)
        total = complaints.count()

        serializer = DashboardMetricsSerializer({
            "total_complaints": total,
            "resolved_count": resolved,
            "in_progress": status_count.get("InProgress", 0),
            "resolved_percentage": f"{(resolved / total) * 100:.2f}" if total else "0",
            "status_data": status_count,
            "category_data": category_count
        })

        return Response(serializer.data)

