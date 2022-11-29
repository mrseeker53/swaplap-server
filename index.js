// Add express
const express = require('express');
// Add cors
const cors = require('cors');
// Add mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// Add json web token
const jwt = require('jsonwebtoken');
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


// Create a function as middleware to verify JWT token
function verifyJWT(req, res, next) {
    // Set the auth header from headers > authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // If the auth header is not found, return status & message
        return res.status(401).send('unauthorized access');
    }
    // Split the auth token with white space & take the second index item
    const token = authHeader.split(' ')[1];

    // Verify jwt token with token, secret key & call function with error & decoded (value)
    jwt.verify(token, process.env.ACCESS_TOKEN, function (error, decoded) {
        if (error) {
            // If error is found, return status & message
            return res.status(403).send({ message: 'forbidden access' })
        }
        // If error is not found, add decoded with request
        req.decoded = decoded;
        // Call the next()
        next();
    })
}


// Insert documented data as collection to the database
async function run() {
    try {
        // Create database & collection
        const bannerCollection = client.db('swapLap').collection('banner');
        const categoryCollection = client.db('swapLap').collection('category');
        const productCollection = client.db('swapLap').collection('product');
        const usersCollection = client.db('swapLap').collection('users');


        // Create a get API to generate a token (jwt)
        app.get('/jwt', async (req, res) => {
            // Get email from the requested query.email (client side)
            const email = req.query.email;
            // Set query for email
            const query = { email: email };
            // Find by query from the collection (findOne operation)
            const user = await usersCollection.findOne(query);
            // Check the user is valid
            if (user) {
                // Create a token with payload (for email), secretKey (with this key format) & jwt.secret (expires in time)
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
                // Send the token
                return res.send({ accessToken: token });
            }
            // Send empty object with status for invalid user
            res.status(403).send({ accessToken: '' });
        });


        // READ::
        // Create a get API to load banner data from the database (find operation)
        app.get('/banner', async (req, res) => {
            const query = {};
            const banner = await bannerCollection.find(query).toArray();
            res.send(banner);
        });

        // Create a get API to load category data
        app.get('/category', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);
        });

        // Create a get API to load category/:id data from productCollection
        app.get('/category/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id };
            const products = await productCollection.find(query).toArray();
            res.send(products);
        });

        // Create a get API to load data from the database
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });


        // CREATE::
        // Create a post API to send data to the database (insert operation)
        app.post('/users', async (req, res) => {
            // Get data from requested body (client side)
            const user = req.body;
            // Insert data into the collection
            const result = await usersCollection.insertOne(user);
            // Send data with create confirmation
            res.send(result);
        });
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