var express = require("express");
var bodyParser = require("body-parser");
const path = require('path')
const PORT = process.env.PORT || 5000

// Need this to connect to the DB
const connectionString = process.env.DATABASE_URL || "postgres://erlpzgduapjutd:8e441a6e94c2303b22cba3f9e49299b4512d7ad674471a1bfa9774a026e23e44@localhost:5432/d89mifq9oa741m?ssl=true"

const { Pool } = require('pg')
// const pool = new Pool();

const pool = new Pool({connectionString: connectionString});

var app = express()
  app.use(express.static(path.join(__dirname, 'public')))

  // Need this to handle post data
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.get("/clients", function(req, res) {

    console.log(req.body);

    // Test data
    var data = {"user1":{"name":"mahesh","password":"password1","profession":"teacher","id":1},
    "user3":{"name":"ramesh","password":"password3","profession":"clerk","id":3}}

    res.status(200);
    res.setHeader('Content-Type', 'application/json');

    console.log("Returning Response");

    // For testing
    res.json(data);
  });

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

  // Generic error handler
  function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
