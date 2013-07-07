import hashlib
import pickle
import mimetypes

from models import File


def file_keeper_hash(mime, base64):
    print(mime, mimetypes.guess_extension(mime))
    return hashlib.sha224(pickle.dumps((mime, base64))).hexdigest() + mimetypes.guess_extension(mime)


def save_file(mime, base64):
    '''
    Calculate hash of the file, look up in the database,
    save if it's a new one and return its hash.  The hash
    can the be used as URL.
    '''
    hash_ = file_keeper_hash(mime, base64)
    objects = File.objects.filter(hash=hash_)
    if not objects:
        file_ = File(hash=hash_, mime=mime, base64=base64)
        file_.save()
    return hash_
