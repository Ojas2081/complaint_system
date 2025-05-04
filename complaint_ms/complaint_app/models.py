from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Complaint(models.Model):
    complaint_type = models.CharField(max_length=150)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    description = models.CharField(max_length=255)
    status = models.CharField(default="Pending",max_length=50)
    resolution_msg = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.complaint_type + " | " + self.status + " | " + self.description