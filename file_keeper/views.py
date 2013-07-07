from django.http import HttpResponse

from file_keeper.models import File


def get_file(request, hash_):
    file_ = File.objects.get(hash=hash_)
    return HttpResponse(file_.base64.decode('base64'), mimetype=file_.mime)
