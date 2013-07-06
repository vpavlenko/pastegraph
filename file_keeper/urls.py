from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(r'^get/(?P<hash_>[-_A-Za-z0-9]*)$', 'file_keeper.views.get_file', name='get_file'),
)
