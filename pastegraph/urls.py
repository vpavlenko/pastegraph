from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import settings


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'pastegraph.views.home', name='home'),
    # url(r'^pastegraph/', include('pastegraph.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    url(r'^file/', include('file_keeper.urls')),

    url(r'^', include('main_app.urls')),
)

urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
)
