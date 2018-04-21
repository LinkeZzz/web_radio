from django.shortcuts import render
from django.http import HttpResponse
from .models import *
import os
import mimetypes
from django.http import StreamingHttpResponse
from wsgiref.util import FileWrapper



def ct_image(request):
    return render(request, 'radio/index.html', {})

def get_ct_image(request, id=0):
    #TODO: add id-path relationship
    file_path="C:\data.blk"
    filename = os.path.basename(file_path)
    chunk_size = 8192
    response = StreamingHttpResponse(FileWrapper(open(file_path,'rb'), chunk_size),
                                     content_type=mimetypes.guess_type(file_path)[0])
    response['Content-Length'] = os.path.getsize(file_path)
    response['Content-Disposition'] = "attachment; filename=%s" % filename
    return render(request, 'radio/index.html', {})

def get_ecg_image(request):
    pass

def get_csv_file(request):
    # TODO: add id-path relationship
    file_path="C:\data.blk"
    filename = os.path.basename(file_path)
    chunk_size = 8192
    response = StreamingHttpResponse(FileWrapper(open(file_path,'rb'), chunk_size),
                                     content_type=mimetypes.guess_type(file_path)[0])
    response['Content-Length'] = os.path.getsize(file_path)
    response['Content-Disposition'] = "attachment; filename=%s" % filename
    return response
