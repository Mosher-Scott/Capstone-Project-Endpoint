'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const http = require('http');

var bodyParser = require("body-parser");

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 8080;

// Use these for authentication & logging
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Handle JWT's & public keys
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
app.use(helmet());

// Need this to handle post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS for all requests
app.use(cors());

// Log HTTP requests
app.use(morgan('combined'));

// Route files that are needed
const clientRoutes = require('./routes/clients');
const trainingSessionRoutes = require('./routes/trainingsessions');
const exerciseRoutes = require('./routes/exercises');
const muscleGroupRoutes = require('./routes/muscleGroups');

// Set paths
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', express.static(path.join(__dirname, 'testheroku')));

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/public/sitedetails.html")
})

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});