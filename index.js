// Add express
const express = require('express');
// Add cors
const cors = require('cors');
// Add mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
// Require dotenv & call config
require('dotenv').config();
// Initialize express
const app = express();
// Add port if server doesn't give any port, default port is 5000
const port = process.env.PORT || 5000;


// middleware
// Use express from the client side
app.use(cors());
// Get data from the post request & convert stringify to js object
app.use(express.json());


// Connection string
// Set username & password dynamically using process.env.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.twsrnvr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// Insert documented data as collection to the database
async function run() {
    try {
        // Create database & collection
        const bannerCollection = client.db('swapLap').collection('banner');
        const categoryCollection = client.db('swapLap').collection('category');


        // Create a get API to load banner data from the database (find operation)
        app.get('/banner', async (req, res) => {
            const query = {};
            const banner = await bannerCollection.find(query).toArray();
            res.send(banner);
        });

        // Create a get API to load category data
        app.get('/', async (req, res) => {
            const query = {};
            const home = await categoryCollection.find(query).toArray();
            res.send(home);
        })
    }
    finally {

    }
}

// Call the function with catch
run().catch(error => console.error(error));


// Create GET request to test
app.get('/', (req, res) => {
    res.send("Swaplap server is running");
});

// Initialize server
app.listen(port, () => {
    console.log(`Swaplap server is running on port ${port}`);
});