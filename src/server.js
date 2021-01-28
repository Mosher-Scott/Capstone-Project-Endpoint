require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const { get } = require('http');

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

/// Test endpoint
// app.get("/clientstest", function(req, res) {

//   console.log(req.body);

//   // Test data
//   var data = {"user1":{"name":"mahesh","password":"password1","profession":"teacher","id":1},
//   "user3":{"name":"ramesh","password":"password3","profession":"clerk","id":3}}

//   res.status(200);
//   res.setHeader('Content-Type', 'application/json');

//   console.log("Returning Response");

//   // For testing
//   res.json(data);
// });

// Clients endpoint, optional userId parameter
app.get("/clients/:userId?", handleGetAllClientData);

// Get training sessions assigned to a specific user
app.get("/clients/:userId/trainingsessions", handleGetClientTrainingSessions);



// This must be last.  It is the catch all for wrong endpoints
app.get("*", handleError);

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// Generic error handler
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// Default function for getting client data from the database.  Can be copied/pasted for the other endpoints
function handleGetAllClientData(request, response) {
  console.log("Now getting all client info");

  var userId = request.params.userId;

  // Run the method to pull data from the database
  getClientDataFromDb(userId, function(error, result) {

    if (error || result == "undefined") {
      console.log("Either an error or result was undefined");
      response.statusCode = 404;
      response.json({success:false, data:error});
    }

    console.log(result);

    // If query ran successfully but there was no results
    if (result.length == 0) {
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
  }) // end of getClientDataFromDb method
} // End of handling client data method

// Method for returning all client data, or just single client info
function getClientDataFromDb(id, callback){

  console.log("Now getting client information from the database")

  var sql;

  // Check the user id.  If it is null, then return all user information
  if (id == null) {
    sql = "SELECT c.id AS client_id, json_build_object('firstName', c.firstName, 'lastName', c.lastName, 'client_active_flag', c.active, 'client_contact', json_build_object( 'address', ci.streetAddress, 'city', ci.city, 'state', ci.state, 'zipcode', ci.zipcode,'phone', ci.phone, 'email', ci.email, 'registration_date', ci.registrationDate),'assigned_training_sessions', json_agg(json_build_object ('session_id', ts.id, 'session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'session_sets', ts.sessionSets, 'session_reps', ts.sessionreps, 'session_active_flag',ts.active))) client_details FROM client AS c JOIN client_Info AS ci ON ci.clientid = c.id INNER JOIN client_training_session AS cts ON cts.clientid = c.id INNER JOIN training_session AS ts ON ts.id = cts.sessionid GROUP BY c.id, ci.streetaddress, ci.city, ci.state, ci.zipcode, ci.phone, ci.email, ci.registrationDate ORDER BY c.id ASC;";

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
  
  // If there is a userid, search for it
  else {
    sql = "SELECT c.id AS client_id, json_build_object('firstName', c.firstName, 'lastName', c.lastName, 'client_active_flag', c.active, 'client_contact', json_build_object( 'address', ci.streetAddress, 'city', ci.city, 'state', ci.state, 'zipcode', ci.zipcode,'phone', ci.phone, 'email', ci.email, 'registration_date', ci.registrationDate),'assigned_training_sessions', json_agg(json_build_object ('session_id', ts.id, 'session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'session_sets', ts.sessionSets, 'session_reps', ts.sessionreps, 'session_active_flag',ts.active))) client_details FROM client AS c JOIN client_Info AS ci ON ci.clientid = c.id INNER JOIN client_training_session AS cts ON cts.clientid = c.id INNER JOIN training_session AS ts ON ts.id = cts.sessionid WHERE c.id = $1::int GROUP BY c.id, ci.streetaddress, ci.city, ci.state, ci.zipcode, ci.phone, ci.email, ci.registrationDate;";

    const params = [id];

    pool.query(sql, params, function(err, result) {
    
      if(err) {
      console.log("an error occurred")
      console.log(err)
      callback(err, null);
      } else {
        callback(null, result.rows);
      }
    
    }) // end of pool
  }
} // end of getClientDataFromDb

// Handles requests to get training sessions
function handleGetClientTrainingSessions(request, response) {
  console.log("Attempting to get training sessions")

  response.status(200);
  response.setHeader('Content-Type', 'application/json');
  response.send("Hi there");
}