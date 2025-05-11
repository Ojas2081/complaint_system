from rest_framework import serializers
from complaint_app.models import Complaint
from user_app.api.serializers import UserRegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ComplaintSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(read_only = True)
    user = UserRegisterSerializer(read_only = True)
    # assigned_to = UserRegisterSerializer()
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_company_user=True),
        required=False,
        allow_null=True
    )
    file = serializers.FileField(required=False, allow_null=True)
    # user_complaints = UserRegisterSerializer(read_only=True)
    class Meta:
        model = Complaint
        fields = "__all__"

    # def create(self, validated_data):
    #     return UserComplaint.objects.create(**validated_data)


    # def validate(self, data):
    #     if data['task_name'] == data['task_description']:
    #         raise serializers.ValidationError('TaskName and TaskDescription cannot be same'
    #                                           )
    #     return data

    # def validate_task_name(self, value):
    #     if len(value) < 2:
    #         raise serializers.ValidationError(
    #             'TaskName is too short')
    #     return value

class DashboardMetricsSerializer(serializers.Serializer):
    total_complaints = serializers.IntegerField()
    resolved_count = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    resolved_percentage = serializers.CharField()
    status_data = serializers.DictField(child=serializers.IntegerField())
    category_data = serializers.DictField(child=serializers.IntegerField())