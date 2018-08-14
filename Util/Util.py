# coding=utf-8

import datetime
import json


def _post(request, name):
    try:
        s = request.POST.get(name)
    finally:
        if s == None:
            return ''
        else:
            return s
def getDate():
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def isblank(param):
    if param != None and param.strip() != "%%" and param.strip() != "":
        return True
    else:
        return False
def toJson(param):
    return json.dumps(param,ensure_ascii=False);

def getError():
    return toJson({"Error":"请求出错!"})
    