from django.db import models

# Create your models here.
class UserInfoFormModal (models.Model) :

    HEAR_FORM_CHOICES = [
        ('Flyer at a coffee shop', 'Flyer at a coffee shop'),
        ('Flyer at a Library', 'Flyer at a Library'),
        ('Word of mouth', 'Word of mouth'),
        ('Through a friend', 'Through a friend'),
    ]

    hearFormChoice = models.CharField(max_length=30, choices=HEAR_FORM_CHOICES)
    name = models.CharField(max_length=25)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    