from django.conf.urls import patterns, url

urlpatterns = patterns(
    '',

    url(r'^$', 'main_app.views.paste.home', name='home'),

    url(r'^(?P<link>[-_A-Za-z0-9]*)$', 'main_app.views.paste.show_paste', name='show_paste'),
)
