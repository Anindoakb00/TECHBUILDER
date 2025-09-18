from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserProfile
from .serializers import (
    UserProfileViewSerializer,
    UserProfileUpdateSerializer,
    UserCreateSerializer,
)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileViewSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return UserProfileUpdateSerializer
        elif self.request.method == 'POST':
            return UserCreateSerializer
        return UserProfileViewSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return super().get_queryset().filter(user=self.request.user)