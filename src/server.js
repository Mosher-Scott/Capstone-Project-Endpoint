require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");


const path = require('path')
const PORT = process.env.PORT || 64147

// Routes
const routes = require('./routes/clients');

var app = express();

app.use(express.static(path.join(__dirname, 'public')))


// Need this to handle post data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/clients', routes)

// This must be last.  It is the catch all for wrong endpoints
app.get("/*", function(request, response) {
  console.log("Reached homepage");
  response.sendFile(__dirname + "/public/sitedetails.html")
  //response.status(200).json({"error": "Placeholder for main page, that will contain data"});
});

var server = app.listen(process.env.PORT, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});


