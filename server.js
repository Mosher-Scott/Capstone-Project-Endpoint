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

// Check authentication tokens
const checkAuthentication = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-w4x3pv3a.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://capstone-api-auth',
    issuer: 'https://dev-w4x3pv3a.us.auth0.com/',
    algorithms: ['RS256']
  });



app.use('/', express.static(path.join(__dirname, 'testheroku')));


// Handling the actual requests
// Add checkAuthentication for any endpoint you want users to be authorized to access
// app.use('/clients', checkAuthentication, clientRoutes)
// app.use('/trainingsessions', checkAuthentication, trainingSessionRoutes)
// app.use('/exercises', checkAuthentication, exerciseRoutes)
// app.use('/musclegroups', checkAuthentication, muscleGroupRoutes)

// Not using authentication because I'm lazuy during testing
app.use('/clients', clientRoutes)
app.use('/trainingsessions', trainingSessionRoutes)
app.use('/exercises', exerciseRoutes)
app.use('/musclegroups', muscleGroupRoutes)



// Default
app.get("/*", function(request, response) {
    console.log("Reached homepage");
    response.sendFile(__dirname + "/public/sitedetails.html")
  });

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});