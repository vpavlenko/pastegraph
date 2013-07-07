from django.contrib import admin

from file_keeper.models import File


class FileAdmin(admin.ModelAdmin):
    fields = ('hash', 'mime', 'base64')
    list_display = fields


admin.site.register(File, FileAdmin)
