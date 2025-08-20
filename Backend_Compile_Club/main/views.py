from django.shortcuts import render
import logging

# rest framework stuf
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

# from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# modals + serilzers
from .models import UserInfoFormModal
from .serializers import UserInfoFormSerializer

#util
from .util import get_client_ip


# init logger
logger = logging.getLogger(__name__)  # get a logger for this specific module
# logger.info("Just some info.")

@api_view(['GET'])
@ensure_csrf_cookie
def csrf(request):
    return Response({'ok': True})




# Create your views here.o

def HomePage(request) :
    return render(request, 'index.html')

@api_view(['GET'])
@authentication_classes([])          
def get_user_info_forms(request):
    qs = UserInfoFormModal.objects.all()
    return Response({'count': qs.count()})
    

@api_view(['POST'])
@authentication_classes([]) 
@csrf_protect 
def submit_user_info_form(request):
    ip_address = get_client_ip(request)

    # check if the IP already exists in the DB
    if UserInfoFormModal.objects.filter(ip_address=ip_address).exists():
        return Response(
            {"error": "You've already submitted the form."},
            status=status.HTTP_403_FORBIDDEN
        )

    # pass the request so the serializer can access the IP
    serializer = UserInfoFormSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'submitted'}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)