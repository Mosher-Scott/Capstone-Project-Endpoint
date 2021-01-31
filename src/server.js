require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");

// Use these for authentication
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Handle JWT's & public keys
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');


const path = require('path')
const PORT = process.env.PORT || 64147

// Routes
const clientRoutes = require('./routes/clients');
const trainingSessionRoutes = require('./routes/trainingsessions');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

// Need this to handle post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS for all requests
app.use(cors());

// Log HTTP requests
app.use(morgan('combined'));

// Checking tokens
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


// Add checkAuthentication for any endpoint you want users to be authorized to access
app.use('/clients', checkAuthentication, clientRoutes)
app.use('/trainingsessions', checkAuthentication, trainingSessionRoutes)

// Homepage, doesn't need to be authenticated
app.get("/*", function(request, response) {
  console.log("Reached homepage");
  response.sendFile(__dirname + "/public/sitedetails.html")
  //response.status(200).json({"error": "Placeholder for main page, that will contain data"});
});

var server = app.listen(process.env.PORT, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});


