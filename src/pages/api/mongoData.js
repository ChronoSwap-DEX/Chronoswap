// pages/api/mongoData.js

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = 'mongodb+srv://trevorboultwood:0gdZWu6kqk9oyzf5@cluster0.1wniszp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    
    await client.connect();

    const database = client.db('chronoswap');
    const collection = database.collection('Alph/WIFB');

    
    const data = await collection.find({}).toArray();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
