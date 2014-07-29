from django.shortcuts import render

# Create your views here.

def frontpage(request):
    """ Shows the newspaper frontpage. """
    return render(request, 'frontpage.html')