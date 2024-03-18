from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta
import random
import requests
from decimal import Decimal
import json
import os
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), 'connectionstring.env'))
uri = os.getenv("CONNECTION_STRING")
website = 'https://docs.alephium.org/dapps/public-services/    v113mainet'

alphwifb_ContractID = '2ARBQ8p8sPu1jcUkDgpBrWZT3PXxUUdwQEacxjciCULgw'

alphNGU_ContractID = '21nj6sBTtQfTwCErYAHF3CNBaDRAc1E1Q3aUCcbsuG8mu'

headers = {'accept': 'application/json'}

def get_poolValue(contract):
    # need to grab the decimals of a each token. they are dynamic dependent on contact!!!!!!
   # curl -X 'POST' \
  #'https://backend-v113.mainnet.alephium.org/tokens/fungible-metadata' \
  #-H 'accept: application/json' \
  #-H 'Content-Type: application/json' \
  #-d '[
 # "df3008f43a7cc1d4a37eef71bf581fc4b9c3be4e2d58ed6d1df483bbb83bd200"
#]'

#decimals!!!
    url_token = 'https://backend-v113.mainnet.alephium.org/addresses/'
    response = requests.get(url_token + contract + '/tokens-balance', headers=headers)
    success = False
    if response.status_code == 200:
        json_data = response.json()
        token1 = {
        'tokenId': json_data[0]['tokenId'],
        'balance': (json_data[0]['balance']),
        'lockedBalance': (json_data[0]['lockedBalance'])
        }

        token2 = {
        'tokenId': json_data[1]['tokenId'],
        'balance': (json_data[1]['balance']),
        'lockedBalance': (json_data[1]['lockedBalance'])
        }

        print("Token Balance:", int(token2['balance']))
        #Now we need to get the amount of decimals for the token. We know alephium uses 18 zeros.
        post_data = [token2['tokenId']]
        response = requests.post('https://backend-v113.mainnet.alephium.org/tokens/fungible-metadata',headers=headers, json=post_data)
        if response.status_code == 200:
            json_data = response.json()
            token2_meta = {
                'id': json_data[0]['id'],
                'symbol': json_data[0]['symbol'],
                'name': json_data[0]['name'],
                'decimals': json_data[0]['decimals']
                }
            token2_decimal = (10 ** int(token2_meta['decimals'])) #eg 1000 if decimal equal 3
            response = requests.get(url_token + contract + '/balance', headers=headers)
            if response.status_code == 200:
                json_data = response.json()
                token_alph = {
                'balance': (json_data['balance']),
                'lockedBalance': (json_data['lockedBalance'])
                }
                #wow finally
                success = True
                print('Alph Balance', int(token_alph['balance']))
                return (int(token_alph['balance']) / 1000000000000000000)/(int(token2['balance'])/token2_decimal)
            else:
                print(f"Request failed with status code: {response.status_code}")
                print(response.text)
        else:
            print("Error:", response.status_code, response.text)
    else:
        print(f"Request failed with status code: {response.status_code}")
        print(response.text)
    return 0

def sendComponentToDatabase(collection, collection_name, value):
    timestamp = datetime.utcnow()
    entry = {"time": timestamp, "value": value}
    collection.insert_one(entry)

def connect_to_mongodb(collection_name):
    # Replace these with your MongoDB connection details
    database_name = "chronoswap"

    # Connect to MongoDB
    client = MongoClient(uri)

    # Access the database and collection
    database = client[database_name]
    collection = database[collection_name]

    return client, collection

def pushNGU():
    contract_name = "Alph/NGU"
    poolprice = get_poolValue(alphNGU_ContractID)
    if poolprice > 0:
        print('Pool price of ', contract_name, ' is: ' , poolprice)
        client, collection = connect_to_mongodb(contract_name)
        sendComponentToDatabase(collection, contract_name, poolprice)
        client.close()
    else:
        print("Pool price less than or equal to zero. Data has not been sent to DB")

def pushWIFB():
    contract_name = "Alph/WIFB"
    poolprice = get_poolValue(alphwifb_ContractID)
    if poolprice > 0:
        print('Pool price of ', contract_name, ' is: ' , poolprice)
        client, collection = connect_to_mongodb(contract_name)
        sendComponentToDatabase(collection, contract_name, poolprice)
        client.close()
    else:
        print("Pool price less than or equal to zero. Data has not been sent to DB")

def read_pool_list_json():
    file_path = os.path.join(os.path.dirname(__file__), 'pool_list.json')
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
    print("*******************************************************************")
    print(datetime.utcnow())
    for item in data:
        token_pair = item["token_pair"]
        contract_id = item["contract_id"]
        try:
            poolprice = get_poolValue(contract_id)
            if poolprice > 0:
                print('Pool price of ', token_pair, ' is: ' , poolprice)
                client, collection = connect_to_mongodb(token_pair)
                sendComponentToDatabase(collection, token_pair, poolprice)
                client.close()
            else:
                print("Pool price of ", token_pair, " is less than or equal to zero. Data has not been sent to DB")
            if item != data[-1]:
                print("-------------------------------------")
        except Exception as e:
            print("Error!")
    print("*******************************************************************")




def main():
    #This works
    #pushNGU() 
    #pushWIFB()
    # Load environment variables from .env file

    read_pool_list_json()

    

if __name__ == "__main__":
    main()