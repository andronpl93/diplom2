from django.shortcuts import render
from django.http import HttpResponse
import logging
import json
import csv
import urllib.request
import xml.etree.ElementTree as et
import time



# Create your views here.
def start(request):
    return render(request,'schedule/index.html',{})

def graf(request,currency='EUR'):   # курс валют
    a=[]
    for i in url[currency]:
        a.append(i[0])

    return HttpResponse(json.dumps(normalize(parsers[currency](a))))

def couple(request,cur1='EUR',cur2='RUB',currency='USD'):   # попарное сравнение
    a=[]
    a.append(cur1)
    a.append(cur2)
    pak=normalize(parsers[currency](a))
    pak['len']=1
    for i in range(len(pak['dat'][1])):
        pak['dat'][1][i][0]=pak['dat'][3][i][1]
    return HttpResponse(json.dumps(pak))



def update_select(request,currency):
    sel=[]
    for i in url[currency]:
        sel.append(i[0])
    return render(request,'schedule/select.html',{'select':sel})

def parseEUR(curr):
    paket={'dat':[],'len':len(url['EUR'])}

    for u in range(len(url['EUR'])):
        if not url['EUR'][u][0] in curr:
            continue
        a=parser(url['EUR'][u])

        b = []
        for i in range(len(a)):
            for j in range(len(a[i])):
                b.append(a[i][j])

        paket['dat'].append([url['EUR'][u][0]])
        paket['dat'].append([])
        for i in range(len(b)):
            for j in range(len(b[i])):
                    if b[i][j].get("OBS_VALUE"):
                        paket['dat'][-1].append([])
                        mil=time.mktime(time.strptime(b[i][j].get("TIME_PERIOD"), '%Y-%m-%d'))*1000
                        mil=int(mil)
                        paket['dat'][-1][-1].append(mil)
                        paket['dat'][-1][-1].append(float(b[i][j].get("OBS_VALUE")))

    return paket


def parseRUB(curr):
    paket={'dat':[],'len':len(url['RUB'])}

    for u in range(len(url['RUB'])):
        if not url['RUB'][u][0] in curr:
            continue

        a=parser(url['RUB'][u])

        d = []
        for i in range(len(a)):
            d.append(a[i].get('Date'))

        b = []
        for i in range(len(a)):
            b.append(a[i][1].text)

        paket['dat'].append([url['RUB'][u][0]])
        paket['dat'].append([])
        for i in range(len(b)):
            paket['dat'][-1].append([])
            mil=time.mktime(time.strptime(d[i], '%d.%m.%Y'))*1000
            mil=int(mil)
            paket['dat'][-1][-1].append(mil)
            paket['dat'][-1][-1].append(float(b[i].replace(',', '.')))

    return paket


def normalize(paket):
    for i in range(1,len(paket['dat']),2):
        standart=paket['dat'][i][0][-1]
        for j in range(len(paket['dat'][i][:])):
            paket['dat'][i][j][-1]=round(paket['dat'][i][j][-1]/standart,2)

    return paket

def parser(url):
    tree = []
    urllib.request.install_opener(urllib.request.build_opener(urllib.request.ProxyHandler({' HTTP': 'proxy.server: 3128'})))
    tree.append(et.parse(urllib.request.urlopen(url[1])))

    root = []
    for i in range(len(tree)):
        root.append(tree[i].getroot())

    a = []
    for i in range(len(root)):
        for j in range(len(root[i])):
            a.append(root[i][j])

    return a


parsers={
    'EUR':parseEUR,
    'RUB':parseRUB,
    'USD':parseRUB,
    'UAH':parseRUB
}

url={
    'EUR':[['JPY',"http://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/jpy.xml"],
           ['USD','http://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/usd.xml'],
           ['CAD',"http://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/cad.xml"],
           ['AUD',"http://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/aud.xml"],
           ['QDP',"http://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/gbp.xml"]],
    'RUB':[ ['USD','http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=01/01/1999&date_req2=31/12/2044&VAL_NM_RQ=R01235'],
           ['AUD','http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=01/01/1999&date_req2=31/12/2044&VAL_NM_RQ=R01010']]
           # ['GBP','http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=01/01/1999&date_req2=31/12/2044&VAL_NM_RQ=R01035' ],
          #  ['EUR','http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=01/01/1999&date_req2=31/12/2044&VAL_NM_RQ=R01239'],
         #   ['CAD','http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=01/01/1999&date_req2=31/12/2044&VAL_NM_RQ=R01350']],

}
logging.basicConfig(
	level = logging.DEBUG,
	format = '%(asctime)s %(levelname)s %(message)s',
)


