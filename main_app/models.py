from django.db import models


class Paste(models.Model):
    source = models.TextField()
