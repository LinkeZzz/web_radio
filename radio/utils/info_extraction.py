import os
import csv
import pandas as pd
import numpy as np

#TODO:change {$dir} for prod
dir =  "/home/linke/Desktop/web_radio/data/"
f_name = ["info/true/annotations.csv", "info/predict/predictions.csv", "scans/"]

def read_csv(dir, f_name):
    '''
    Create dictionary key-seriesuid value-[] from csv file
    :param dir:
    :param f_name:
    :return:
    '''

    dir = dir+f_name
    scans_dt = pd.read_csv(dir).T.to_dict()
    new_dt ={}
    for key, value in scans_dt.items():
        new_key = value['seriesuid']
        if new_key in scans_dt:
            new_dt[new_key].append(value)
        else:
            new_dt.setdefault(new_key, []).append(value)
    return new_dt

def read_scans(dir, f_name):
    '''
    Create list of available blk files from dir
    set based on seriesuid
    :param dir: path
    :param f_name: file name
    :return: set (string/unicode)
    '''
    scans_dt = set()
    dir = dir+f_name
    for file in os.listdir(dir):
        file_name = os.fsencode(file)
        if file_name.endswith(b'.blk'):
            f_seriesuid = file_name[:-4]
            scans_dt.add(f_seriesuid.decode("unicode_escape"))
    return scans_dt

def get_view_list():
    '''
    Creates view list for main page contains info
    seriesuid/bool/bool (id, true_info, predict_info)
    :return:
    '''
    view_list={}
    list_set = read_scans(dir, f_name[2])
    list_predict = read_csv(dir, f_name[1])
    list_true = read_csv(dir, f_name[0])

    for key in  list_set:
        value=[]
        if key in list_true:
            value.append(True)
        else:
            value.append(False)

        if key in list_predict:
            value.append(True)
        else:
            value.append(False)
        view_list[key] = value

    return view_list
