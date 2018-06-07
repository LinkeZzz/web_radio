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
from bottle import request, route, run
import pydicom
import sys

csv_filepath = "/home/linke/Desktop/web_radio/radio/static/annotations.csv"
before = 0

def get_data(request):
    pass

def read_blosc(file):
    with open(file, mode='rb')as file:
        packed = file.read()
    array = blosc.unpack_array(packed)
    return array

def ct_image(request):
    return render(request, 'radio/index.html', {})

# work with CSV
def read_csv(id, filepath):

    output = {}
    i = 0
    with open(filepath, 'rt', encoding='ascii') as csvfile:
        csv_reader = csv.reader(csvfile)
        for row in csv_reader:
            if(row[0] != 'seriesuid'):
                out = {}
                out['seriesuid'] = row[0]
                out['coordX'] = int(float(row[1].replace('\'','')))
                out['coordY'] = int(float(row[2].replace('\'','')))
                out['coordZ'] = int(float(row[3].replace('\'','')))
                out['diameter_mm'] = int(float(row[4].replace('\'','')))
                output[i] = out
                i+=1
    return output

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
    dicom_file_path = "/home/linke/Desktop/web_radio/radio/static/MRBRAIN.DCM"

    array = read_blosc(file_path)

    if request.method == 'GET' and request.is_ajax():

        get_csv = request.GET.get('get_csv')
        draw = request.GET.get('draw')
        chunk = request.GET.get('chunk_N')
        binary = request.GET.get('binary')

        global before
        before = request.GET.get('before')
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
            array = ((array-array.min())/ (array.max()-array.min()))
            array*=255;
            array = array.astype(np.uint8)
            array = array.tolist()
            d = {}
            i = 0
            for x in array:
                d[i]=x
                i+=1
            out = json.dumps(d)
            return HttpResponse(out)
        if get_csv:
            out = read_csv(0, csv_filepath)
            out = json.dumps(out)
            return HttpResponse(out)
        if chunk:
            chunk_number = int(request.GET.get('chunk_N'));
            chunk_size = int(request.GET.get('chunk_S'));
            d = {}
            index=0
            for x in range(chunk_number*chunk_size,(chunk_number+1)*chunk_size):
                dd = {}
                index2 = chunk_number*chunk_size
                for xx in array[x]:
                    dd[index2] = xx.tolist()
                    index2+=1
                d[index] = dd
                index+=1
            out = json.dumps(d)
            return HttpResponse(out)
        '''if binary:
            data = array
            data = data.ravel()
            # normalize array to uint8 [0 255] grayscale
            data *= (255 / data.max())
            data = data.astype(np.uint8)
            # convert to from numpy to list
            data = data.tolist()

            data = data[0:5]
            response = HttpResponse(data)
            response['Content-Type'] = 'application/octet-stream'
            #response['Content-Length'] = sys.getsizeof(data)
            # data = pydicom.dcmread(dicom_file_path)
            return response'''


    if request.method == 'GET' and before == '1':
        # stretch array to 1-dim array
        data = array
        data = data.ravel()
        # normalize array to uint8 [0 255] grayscale
        data *= (255/data.max())
        data = data.astype(np.uint8)
        #convert to from numpy to list
        data = data.tolist()

        data = data[0:5]
        response = HttpResponse(data)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Length'] = sys.getsizeof(data)
        #data = pydicom.dcmread(dicom_file_path)
        return response



    return render(request, 'radio/index.html', {})

def get_ecg_image(request):

    response = HttpResponse(content_type='application/jpeg')
    response['Content-Disposition'] = 'filename="somefilename.pdf"'
    p = canvas.Canvas(response)
    p.drawString(100, 100, "Hello world")
    p.showPage()
    p.save()
    return response
