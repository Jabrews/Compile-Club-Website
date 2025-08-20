 
from rest_framework import serializers
from .models import UserInfoFormModal
from .util import get_client_ip


class UserInfoFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfoFormModal
        fields = ['hearFormChoice', 'name', 'created_at', 'ip_address']
        read_only_fields = ['ip_address']  # prevent client from manually setting it


    def create(self, validated_data):
        request = self.context.get('request')
        ip_address = get_client_ip(request)
        validated_data['ip_address'] = ip_address
        return super().create(validated_data)
