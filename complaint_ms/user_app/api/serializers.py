from user_app.models import CustomUser
from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate
from django.utils.translation import gettext as _

# from complaint_app.api.serializers import ComplaintSerializer

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    # user_complaints = ComplaintSerializer(many=True, read_only=True)
    
    confirm_password = serializers.CharField(style={'input_type':'password'},write_only=True)
    is_active = serializers.CharField(read_only=True)
    is_staff = serializers.CharField(read_only=True)
    created_at = serializers.CharField(read_only=True)
    updated_at = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id','email', 'first_name', 'last_name', 'phone_number', 'gender',
            'address', 'zipcode', 'password', 'confirm_password', 'is_company_user', 'is_active','is_staff','created_at', 'updated_at']
        extra_kwargs = {
            'password' : {'write_only' : True}
        }
        
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"error":"Passwords do not match."})
        return data
    
    # def save(self):
    #     if User.objects.filter(email=self.validated_data['email']).exists():
    #         raise serializers.ValidationError({"error":"User with this Email Already Exists"})
        
    # def validate_email(self,value):
    #     print(value,"qq")
    #     if User.objects.filter(email=value).exists():
    #         raise serializers.ValidationError("User with this Email Already Exists")
    #     return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # print("Validated_data ===>> ",validated_data)
        return User.objects.create_user(**validated_data)
    
class UserLoginSerializer(serializers.Serializer):
    """Serializer for the user auth token."""
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
    )

    def validate(self, attrs):
        """Validate and authenticate the user."""
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )
        print("User-->",user)
        if not user:
            msg = _('Unable to authenticate with provided credentials.')
            raise serializers.ValidationError({"errors":msg}, code='authorization')

        attrs['user'] = user
        return attrs
    