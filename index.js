const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON in requests

console.log('Database User:', process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0ozh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db("airbnb"); // Access the correct database
    
    // Get the collections
    const hotelDataCollection = db.collection("hotelData");
    const usersDataCollection = db.collection("users");
    const hotelListCollection = db.collection("hotelList");
    const earningListCollection = db.collection("earningList");

    // Route to fetch hotel data
    app.get('/hotel-data', async (req, res) => {
      try {
        const result = await hotelDataCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to fetch hotel data
    app.get('/users', async (req, res) => {
      try {
        const result = await usersDataCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to fetch hotel list data
    app.get('/hotel-list', async (req, res) => {
      try {
        const result = await hotelListCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching hotel list data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to insert new hotel list data
    app.post('/hotel-list', async (req, res) => {
      try {
        const newItem = req.body;
        const result = await hotelListCollection.insertOne(newItem);
        res.json(result);
      } catch (error) {
        console.error('Error inserting into hotel list data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to fetch earning list data
    app.get('/earningList', async (req, res) => {
      try {
        const result = await earningListCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching earning list data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Start the server after setting up routes and connecting to MongoDB
    app.listen(port, () => {
      console.log(`AirBnb server is running on Port ${port}`);
    });
  } catch (error) {
    console.error('Error running the server:', error);
  }
}

run().catch(console.dir);

// Route for health check
app.get('/', (req, res) => {
  res.send('Airbnb Server is running');
});
