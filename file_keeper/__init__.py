import hashlib
import pickle

from models import File


def file_keeper_hash(mime, base64):
    return hashlib.sha224(pickle.dumps((mime, base64))).hexdigest()


def save_file(mime, base64):
    '''
    Calculate hash of the file, look up in the database,
    save if it's a new one and return its hash.  The hash
    can the be used as URL.
    '''
    hash_ = file_keeper_hash(mime, base64)
    objects = File.objects.filter(hash_=hash_)
    if not objects:
        file_ = File(mime=mime, base64=base64)
        file_.save()
    return hash_
