// Add express
const express = require('express');
// Add cors
const cors = require('cors');
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





// Create GET request to test
app.get('/', (req, res) => {
    res.send("Doctors Portal server is running");
});

// Initialize server
app.listen(port, () => {
    console.log(`Doctors Portal server is running on port ${port}`);
});