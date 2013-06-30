from django.shortcuts import render
from main_app.models import Paste


def home(request):
    return render(request, 'main.html', {})


def show_paste(request, link):
    paste = Paste.objects.get(link=link)
    return render(request, 'main.html', {'paste': paste})
