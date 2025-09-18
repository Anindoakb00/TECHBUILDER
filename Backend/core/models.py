from django.db import models
from django.contrib.auth.models import User


#user profile
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    billing_address = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)


    def __str__(self):
        return self.user.username