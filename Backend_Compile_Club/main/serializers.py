 
from rest_framework import serializers
from .models import UserInfoFormModal

class UserInfoFormSerializer(serializers.ModelSerializer) :
    class Meta :
        model = UserInfoFormModal
        fields = ['hearFormChoice', 'name', 'created_at']
