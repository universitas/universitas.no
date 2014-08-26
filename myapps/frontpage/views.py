from django.shortcuts import render

# Create your views here.

def frontpage_view(request):
    """ Shows the newspaper frontpage. """
    return render(request, 'frontpage.html')