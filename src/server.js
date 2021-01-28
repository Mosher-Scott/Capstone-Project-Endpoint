require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg')

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  sslmode: require,
  reject_unauthorized: true
});

var app = express();

app.use(express.static(path.join(__dirname, 'public')))

// Need this to handle post data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/clientstest", function(req, res) {

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

app.get("/clients/:userId?", handleGetAllClientData);

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// Generic error handler
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

function handleGetAllClientData(request, response) {
  console.log("Now getting all client info");

  var userId = request.params.userId;

  // If the userId wasn't sent, then get all client data
  if(userId == null) {

    // Run the method to pull data from the database
    getAllClientDataFromDb(function(error, result) {

      if (error || result == "undefined") {
        console.log("Either an error or result was undefined");
        response.statusCode = 404;
        response.json({success:false, data:error});
      }

      // If query ran successfully but there was no results
      if (result == null) {
        console.log("No results returned");
        response.statusCode = 204;
        response.end();
      } 

      else {
        console.log("Clients found");

        const clients = result;

        response.status(200);

        response.setHeader('Content-Type', 'application/json');
        response.json(clients);
      }


    }) // End of  if statement

  } else {
      // TODO: Update this to actually pull single client data
      response.status(200);
      response.setHeader('Content-Type', 'application/json');
      response.send("You picked userID " + userId);
  }

}

function getAllClientDataFromDb(callback){

  console.log("Now getting all clients from the database")

  const sql = "SELECT * FROM client ORDER BY id ASC";

  pool.query(sql, function(err, result) {
    
    if(err) {
    console.log("an error occurred")
    console.log(err)
    callback(err, null);
    } else {
      callback(null, result.rows);
    }
  
  }) // end of pool
}