from django.shortcuts import render

# Create your views here.

def frontpageView(request):
    """ Shows the newspaper frontpage. """
    return render(request, 'frontpage.html')