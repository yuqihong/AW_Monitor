# coding=UTF-8
import json
import datetime
import requests
import warnings
from django.shortcuts import render
from django.http.response import HttpResponse

AWServer='https://hcpanywhere.hdslab.net'
AWServer1='https://hcpanywhere.hdslab.net:8000'
FSAPIUri=AWServer1+'/login/oauth/'
FSReportUri=AWServer1+'/mapi/report/admin/user/devices'
FSSAPIVersion='3.0.3'
ManagementAPIVersion='2.1.0'
TokenUser='user02'
TokenPwd='Welcome123'
uniqueId='969334AD-44FA-4023-8D49-A1817E12E49F'

def getAwView(request):
    return render(request,'AW_PROJECT/view/aw.html')

#获得请求数据
def getAWData(request):
    warnings.filterwarnings('ignore')
    json=getAWReport(FSReportUri)
    return HttpResponse(json)

#获取数据后进行重启HCP系统
def getDataByStart(request):
    warnings.filterwarnings('ignore')
    srcDataDict=getAWReport(FSReportUri)
    
    for item in range(len(srcDataDict['users'])):
        itemDict=srcDataDict['users'][item]
        userDict=itemDict['user']
        awUserNameStr=userDict['name']
        devList=itemDict['clients']
        awuserClients=''
        for i in range(len(devList)):
            devNameStr=devList[i]['name'].replace('User Portal','Web UI')
            devOSStr=devList[i]['OS']
            devVerStr=devList[i]['version'].replace('None','N/A')
            devLastAccessInt=devList[i]['lastAccess'] / 1000.0 
            devLastAccessDate=datetime.datetime.fromtimestamp(devLastAccessInt)
            currTime=datetime.datetime.now()
    
            awuserClients+=devNameStr+','+devOSStr+','+devVerStr+','+str(devLastAccessDate)+';'
            #print(awuserClients)
            #replace_reg=re.compile(r';$')
            # if(devNameStr=='PC0EBLT5' and (currTime - devLastAccessDate).seconds > 3):
            #     print("Detected AW client maybe lost connection to server, restarting it now....")
            #     os.system('taskkill /F /IM hcpaw.exe /T')
            #     subprocess.Popen('C:/Program Files/Hitachi Data Systems/HCP Anywhere/hcpaw.exe',shell=True,stdout=subprocess.PIPE)
        #print(awUserNameStr,replace_reg.sub('',awuserClients),sep=",")

def getAWReport(URI):
    uri=URI
    payload={'scope': 'SYSTEM', 'startTime': 1477946344000,'endTime': 1990000000000}
    TokenStr='Bearer '+getToken(FSAPIUri).replace('\u003d','=')
    header={'Accept': 'application/json', 'Authorization': TokenStr, 'X-HCPAW-MANAGEMENT-API-VERSION': ManagementAPIVersion,'X-HCPAW-DEVICE-ID':uniqueId}
    r=requests.post(uri,data=json.dumps(payload),headers=header,verify=False)
    print(r)
    return r

def getToken(URI):
    uri=URI
    payload={'username': TokenUser, 'password': TokenPwd, 'grant_type': 'urn:hds:oauth:negotiate-client','uniqueId': uniqueId}
    header={'X-HCPAW-MANAGEMENT-API-VERSION': ManagementAPIVersion,'Accept': 'application/json','Content-Type': 'application/json'}
    r=requests.post(uri,data=json.dumps(payload),headers=header,verify=False)
    res = json.loads(r.content)
    return res['access_token']


