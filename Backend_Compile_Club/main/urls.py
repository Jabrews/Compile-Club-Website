from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
   path('', views.HomePage, name='homepage'),
   path('home', views.HomePage, name='homepage'),

   # api shiznet
   path('api/get_user_info_forms/', views.get_user_info_forms, name='forms-list'),
   path('api/submit_user_info_form/', views.submit_user_info_form, name='submit-new-form')
]
