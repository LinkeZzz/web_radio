from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from django.http import StreamingHttpResponse
from django.core import serializers
from django.http import HttpResponse
from json import JSONEncoder
from django.http import JsonResponse
from django.template import Context, Template
import csv

import datetime
import blosc
import os
import mimetypes
from wsgiref.util import FileWrapper
from json import JSONEncoder
import codecs
import json
import numpy as np
from reportlab.pdfgen import canvas
from django.http import HttpResponse

csv_filepath = "/home/linke/Desktop/web_radio/radio/static/annotations.csv"

def read_blosc(file):
    with open(file, mode='rb')as file:
        packed = file.read()
    array = blosc.unpack_array(packed)
    return array

def ct_image(request):
    return render(request, 'radio/index.html', {})

# work with CSV
def read_csv(id, filepath):

    out = {}
    with open(filepath, 'rt', encoding='ascii') as csvfile:
        csv_reader = csv.reader(csvfile)
        for row in csv_reader:
            if(row[0] != 'seriesuid'):
                out['seriesuid'] = row[0]
                out['coordX'] = int(float(row[1].replace('\'','')))
                out['coordY'] = int(float(row[2].replace('\'','')))
                out['coordZ'] = int(float(row[3].replace('\'','')))
                out['diameter_mm'] = int(float(row[4].replace('\'','')))
                return out
    return out

def write_csv(filepath,json):

    with open(filepath, 'a') as csvfile:
        fieldnames = []
        fieldnames.append('seriesuid')
        fieldnames.append('coordX')
        fieldnames.append('coordY')
        fieldnames.append('coordZ')
        fieldnames.append('diameter_mm')
        writer = csv.writer(csvfile)
        for j in json:
            json[j] = {v: k for k, v in json[j].items()}
            writer.writerow(json[j])


def get_ct_image(request):

    file_path = "/home/linke/Desktop/web_radio/radio/static/data.blk"

    array = read_blosc(file_path)

    if request.method == 'GET' and request.is_ajax():

        get_csv = request.GET.get('get_csv')
        draw = request.GET.get('draw')
        if draw:
            x = int(request.GET.get('x'))
            y = int(request.GET.get('y'))
            z = int(request.GET.get('z'))
            s = x

            if (int(request.GET.get('axis'))==1):
                array = np.swapaxes(array, 0, 1)#ok
                s = y

            if (int(request.GET.get('axis'))==2):
                array = np.swapaxes(array, 0, 2)#ok
                s = z

            array = array[s]

            array = array.tolist()
            d = {}
            i = 0
            for x in array:
                d[i]=x
                i+=1
            out = json.dumps(d)
            return HttpResponse(out)
        if get_csv:

            d = {}
            out = json.dumps(d)
            return HttpResponse(out)

    return render(request, 'radio/index.html', {})

def get_ecg_image(request):

    response = HttpResponse(content_type='application/jpeg')
    response['Content-Disposition'] = 'filename="somefilename.pdf"'
    p = canvas.Canvas(response)
    p.drawString(100, 100, "Hello world")
    p.showPage()
    p.save()
    return response
