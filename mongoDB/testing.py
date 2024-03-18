from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv
import os


load_dotenv(os.path.join(os.path.dirname(__file__), 'connectionstring.env'))
uri = os.getenv("CONNECTION_STRING")

def pingDB():
# Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

def connect_to_mongodb():
    # Replace these with your MongoDB connection details
    database_name = "chronoswap"
    collection_name = "alph/chronx"

    # Connect to MongoDB
    client = MongoClient(uri)

    # Access the database and collection
    database = client[database_name]
    collection = database[collection_name]

    return client, collection
def retrieve_data(collection):
    # Retrieve all documents in the collection
    #cursor = collection.find()

    # Retrieve all documents in the collection and sort by 'time' in ascending order
    cursor = collection.find().sort('time', 1)
    
    # Return the documents as a list
    return list(cursor)

def retrieve_and_print_data(collection):
    # Retrieve all documents in the collection
    cursor = collection.find()

    # Print each document
    for document in cursor:
        print(document)

def generate_test_data(collection):
    # Initialize i before the loop
    i = 0
    datasize = 500
    
    # Generate 10 time and value entries
    for _ in range(datasize):
        timestamp = datetime.utcnow() + timedelta(minutes=15 * i)
        value = round(random.uniform(1.0, 5.0), 2)  # Random value between 1.00 and 5.00

        entry = {"time": timestamp, "value": value}
        collection.insert_one(entry)
        
        # Increment i inside the loop
        i += 1

def delete_document(collection, condition):
    # Delete the specified condition
    result = collection.delete_many(condition)

    # Print the result
    print(f"Deleted {result.deleted_count} document(s)")
        
def delete_testing(collection):
        # Specify the condition for deletion
    condition = {"value": {"$lt": 2.0}}  # Delete documents with "value" less than 2.0
    # Delete documents based on the condition
    delete_document(collection, condition)

def print_data_in_nice_format(data):
    # Print data in a nicer format
    for entry in data:
        time_str = entry['time'].strftime('%d/%m/%Y %H:%M:%S')
        value = entry['value']
        print(f"Time: {time_str}  Value: ${value:.2f}")


def main():
    client, collection = connect_to_mongodb()
    # Delete all documents in the collection
    #result = collection.delete_many({})
    #generate test data
    generate_test_data(collection)


    #retrieve_and_print_data(collection)

    data = retrieve_data(collection)
    print_data_in_nice_format(data)

    client.close()

if __name__ == "__main__":
    main()