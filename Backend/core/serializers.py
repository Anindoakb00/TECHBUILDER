from rest_framework import serializers

from django.contrib.auth.models import User

from .models import UserProfile

class UserProfileViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user']

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'city', 'country', 'billing_address', 'postal_code']
    

class UserCreateSerializer(serializers.ModelSerializer):
    # UserProfile fields
    phone_number = serializers.CharField(max_length=15, required=False)
    city = serializers.CharField(max_length=100, required=False)
    country = serializers.CharField(max_length=100, required=False)
    billing_address = serializers.CharField(max_length=255, required=False)
    postal_code = serializers.CharField(max_length=20, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 
                 'phone_number', 'city', 'country', 'billing_address', 'postal_code']
    
    def create(self, validated_data):
        # Extract user data
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'password': validated_data.pop('password'),
        }
        
        profile_data = {
            'phone_number': validated_data.pop('phone_number', None),
            'city': validated_data.pop('city', None),
            'country': validated_data.pop('country', None),
            'billing_address': validated_data.pop('billing_address', None),
            'postal_code': validated_data.pop('postal_code', None),
        }

        # Add optional user fields if provided
        if 'first_name' in validated_data:
            user_data['first_name'] = validated_data.pop('first_name')
        if 'last_name' in validated_data:
            user_data['last_name'] = validated_data.pop('last_name')
        
        # Create user
        user = User.objects.create_user(**user_data)
        
        # Create user profile with remaining data
        user_profile = UserProfile.objects.create(user=user, **profile_data)
        
        return user


