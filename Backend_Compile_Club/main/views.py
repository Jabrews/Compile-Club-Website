from django.shortcuts import render
import logging

# init logger
logger = logging.getLogger(__name__)  # get a logger for this specific module
# logger.info("Just some info.")


# Create your views here.o

def HomePage(request) :
    return render(request, 'index.html')