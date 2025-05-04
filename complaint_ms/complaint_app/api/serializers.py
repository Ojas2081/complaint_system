from rest_framework import serializers
from complaint_app.models import Complaint
from user_app.api.serializers import UserRegisterSerializer

class ComplaintSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only = True)
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