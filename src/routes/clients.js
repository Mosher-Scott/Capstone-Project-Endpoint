// For routing client requests
var express = require('express');
var app = express.Router();

const { Pool } = require('pg');
const { get } = require('http');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  sslmode: require,
  reject_unauthorized: true
});

//#region Clients endpoints
// Get all users, or if userId is supplied get individual client
app.get("/:userId?", handleGetAllClientData);

// Delete a user
app.delete("/clients/:userId", handleDeleteClient);

// Add a new user
app.post("/clients", handleAddNewClient);

// Not used
app.put("/clients", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// Update a user
app.patch("/clients", handleAddNewClient);


// Get training sessions assigned to a specific user
app.get("/clients/:userId/trainingsessions", handleGetClientTrainingSessions);

// Not used
app.put("/clients/:userId/trainingsessions", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// Not used
app.post("/clients/:userId/trainingsessions", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// Not used
app.patch("/clients/:userId/trainingsessions", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// Not used
app.delete("/clients/:userId/trainingsessions", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});


// Add a new training session to a user
app.post("/clients/:userId/trainingsessions/:trainingSessionId", handleAddClientTrainingSessions);

// Get workout history for a specific clientId
app.get("/clients/:userId/workouts", handleGetClientWorkouts);

// Get a specific workout for a given clientId
app.get("/clients/:userId/workouts/:workoutId", handleGetSpecificClientWorkout);

//#endregion



  module.exports = app;

  /************** GET Endpoint Handling Methods ****************/
//#region GET Endpoint Handling
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

// Post a new client to the database
function handleAddNewClient(request, response) {

}

// Get all training sessions assigned to the client
function handleGetClientTrainingSessions(request, response) {
  console.log("Attempting to get training sessions")

  response.status(200);
  response.setHeader('Content-Type', 'application/json');
  response.send("Hi there");
}

// Gets all workouts a client has done
function handleGetClientWorkouts(request, response) {

}

// Get a specific workout by a specific client
function handleGetSpecificClientWorkout(request, response) {

}
//#endregion

/************** POST Endpoint Handling Methods ****************/
//#region POST Endpoint Handling
function handleAddClientTrainingSessions(request, response){

}

//#endregion

/************** DELETE Endpoint Handling Methods ****************/
//#region Delete Endpoint Handling
function handleDeleteClient(request, response) {

}
//#endregion

/************** Database Query Methods ****************/
//#region Database Methods
// Method for returning all client data, or just single client info
function getClientDataFromDb(id, callback){

  console.log("Now getting client information from the database")

  var sql;

  // Check the user id.  If it is null, then return all user information
  if (id == null) {
    sql = "SELECT c.id AS client_id, json_build_object('firstName', c.firstName, 'lastName', c.lastName, 'client_active_flag', c.active, 'client_contact', json_build_object( 'address', ci.streetAddress, 'city', ci.city, 'state', ci.state, 'zipcode', ci.zipcode,'phone', ci.phone, 'email', ci.email, 'registration_date', ci.registrationDate),'assigned_training_sessions', json_agg(json_build_object ('session_id', ts.id, 'session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'session_sets', ts.sessionSets, 'session_reps', ts.sessionreps, 'session_active_flag',ts.active))) client_details FROM client AS c JOIN client_Info AS ci ON ci.clientid = c.id LEFT JOIN client_training_session AS cts ON cts.clientid = c.id LEFT JOIN training_session AS ts ON ts.id = cts.sessionid GROUP BY c.id, ci.streetaddress, ci.city, ci.state, ci.zipcode, ci.phone, ci.email, ci.registrationDate ORDER BY c.id ASC;";

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

//#endregion