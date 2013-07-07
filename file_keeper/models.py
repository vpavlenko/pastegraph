from django.db import models


class File(models.Model):
    hash = models.CharField(max_length=100, db_index=True, unique=True)
    # although sha224 uses only 56 characters

    mime = models.CharField(max_length=100)
    base64 = models.TextField()
