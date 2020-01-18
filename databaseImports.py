import json
import jsonpickle
import timeit
t = timeit.Timer('char in text', setup='text = "sample string"; char = "g"')
from dateutil.parser import parse
# import API
from simple_rest_client.api import API
from pymongo import MongoClient
# pprint library is used to make the output look more pretty
from pprint import pprint
# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient('mongodb://localhost:27017/')
db=client.Weather
# Issue the serverStatus command and print the results
serverStatusResult=db.command("serverStatus")
print(serverStatusResult)
start_timestamp = 20190901000000
end_timestamp = 20190907000000

api = API(
     api_root_url='http://mesonet.k-state.edu/rest', # base api url in this case its mesonet
     params={}, # default params
     headers={}, # default headers
     timeout=60, # default timeout in seconds
     append_slash=False, # append slash to final url
     json_encode_body=True, # encode body as json
)

api.add_resource(resource_name='stationdata')

# Dictionary of list to hold all the stations
#   Add the stations here.
Stations =  {
                'Colby':[],
                'Garden City':[],
                'Hays': [],
                'Manhattan' : [],
                'Parsons': []
            }

''''
These functions update each individual databases.
 '''

# Update Colby Database
def AddToColbyDataBase():
    list = Stations['Colby']
    db.Colby.insert_many(list) 

# Update Garden City Database
def AddToGardenCityDataBase():
    list = Stations['Garden City']
    db.GardenCity.insert_many(list) 

# Update Hays Database
def AddToHaysDatabase():
    list = Stations['Hays']
    db.Hays.insert_many(list) 

# Update Manhattan Database
def AddToManhattanDatabase():
    list = Stations['Manhattan']
    db.Manhattan.insert_many(list) 

# Update Parsons Database
def  AddToParsonsDatabase():
    list = Stations['Parsons']
    db.Parsons.insert_many(list) 

# Function that updates all databases
def UpdateDatabases():
    print("[INFO] Updating Colby database.")
    AddToColbyDataBase()
    print("[SUCCESS] Colby database  has been updated.")
    print("[INFO] Updating Garden City database.")
    AddToGardenCityDataBase()
    print("[SUCCESS] Garden City database has been updated.")
    print("[INFO] Updating Hay database.")
    AddToHaysDatabase()
    print("[SUCCESS] Hays database has been updated.")
    print("[INFO] Updating Manhatatan database.")

    AddToManhattanDatabase()
    print("[SUCCESS] Manhatatan database has been updated.")
    print("[INFO] Updating Parsons database.")
    AddToParsonsDatabase()
    print("[SUCCESS] Parsons database has been updated.")

# This function retrieves data from the API
def RetrieveFromAPI():
    response = api.stationdata.list(body=None,
    params={'stn':'Colby,Garden City,Hays,Manhattan,Parsons',
    'int':'day', 't_start':start_timestamp,
    't_end':end_timestamp, 'vars':'TEMP2MAVG,PRECIP' }, headers={})
    print(start_timestamp,end_timestamp)
    res = response.body
    count = 0
    for line in res.splitlines():
        if count != 0:
            splitString = line.split(',')
            Stations[splitString[1]].append({ 'Timestamp': parse(splitString[0]),'Temp2mavg':float(splitString[2]),'Precip':float(splitString[3])})

        count +=1





def Excecute():
    RetrieveFromAPI()
    UpdateDatabases()
    print("All databases updated!")

Excecute()






