require('dotenv').config();

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


/************** GET Endpoint Handling Methods ****************/
//#region GET Endpoint Handling
// Default function for getting client data from the database.  Can be copied/pasted for the other endpoints
module.exports.handleGetAllClientData = function(request, response) {
  console.log("Now getting all client info");
  console.log("reached the other file");

  var userId = request.params.userId;

  // Run the method to pull data from the database
  getClientDataFromDb(userId, function(error, result) {

    console.log(result);
    if (error || result == "undefined") {
      console.log("Either an error or result was undefined");
      response.statusCode = 404;
      response.json({success:false, data:error});
    }

    else if (result === null ) {
      console.log ("null result");
      response.statusCode = 404;
      response.json({success:false, data:"Nothing"});
    }

    // If query ran successfully but there was no results
    else if (result.length == 0) {
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

// Get all training sessions assigned to the client
module.exports.handleGetClientTrainingSessions = function(request, response) {
  console.log("Attempting to get training sessions")

  var userId = request.params.userId;

  // Run the method to pull data from the database
  getClientTrainingSessionsFromDb(userId, function(error, result) {
 
    if (error || result == "undefined") {
      console.log("Either an error or result was undefined");
      response.statusCode = 404;
      response.json({success:false, data:error});
    }

    // If query ran successfully but there was no results
    else if (result.length == 0) {
      console.log("No results returned");
      response.statusCode = 404;

      var message = "No training sessions found for client " + userId;
      response.setHeader('Content-Type', 'application/json');
      response.json({success:false, data: message});
      //response.end();
    } 

    else {
      console.log("Training sessions found");

      const clients = result;

      response.status(200);

      response.setHeader('Content-Type', 'application/json');
      response.json(clients);
    }
  }) // end of getClientDataFromDb method
}

// Gets all workouts a client has done
module.exports.handleGetClientWorkouts = function(request, response) {
  console.log("Attempting to get workout history for a client")

  var userId = request.params.userId;

  // Run the method to pull data from the database
  getClientWorkoutHistoryFromDb(userId, function(error, result) {
 
    if (error || result == "undefined") {
      console.log("Either an error or result was undefined");
      response.statusCode = 404;
      response.json({success:false, data:error});
    }

    // If query ran successfully but there was no results
    else if (result.length == 0) {
      console.log("No results returned");
      response.statusCode = 404;

      var message = "No workout history found for client " + userId;
      response.setHeader('Content-Type', 'application/json');
      response.json({success:false, data: message});
      //response.end();
    } 

    else {
      console.log("Training sessions found");

      const clients = result;

      response.status(200);
      response.setHeader('Content-Type', 'application/json');
      response.json(clients);
    }
  }) // end of getClientDataFromDb method
}

// Get a specific workout by a specific client
module.exports.handleGetSpecificClientWorkout = function(request, response) {
  console.log("Attempting to get workout history for a client")

  var workoutId = request.params.workoutId;

  // Run the method to pull data from the database
  getSpecificClientWorkoutHistoryFromDb(workoutId, function(error, result) {
 
    if (error || result == "undefined") {
      console.log("Either an error or result was undefined");
      response.statusCode = 404;
      response.json({success:false, data:error});
    }

    // If query ran successfully but there was no results
    else if (result.length == 0) {
      console.log("No results returned");
      response.statusCode = 404;

      var message = "No workout history found id " + workoutId;
      response.setHeader('Content-Type', 'application/json');
      response.json({success:false, data: message});
      //response.end();
    } 

    else {
      console.log("Training sessions found");

      const clients = result;

      response.status(200);
      response.setHeader('Content-Type', 'application/json');
      response.json(clients);
    }
  }) // end of getClientDataFromDb method
}
//#endregion

/************** POST Endpoint Handling Methods ****************/
//#region POST Endpoint Handling

// Post a new client to the database
module.exports.handleAddNewClient = function(request, response) {

}

// Add a training session to a client
module.exports.handleAddClientTrainingSessions = function(request, response){

}

module.exports.handleAddClientWorkout = function(request, response) {
  console.log("Attempting to get workout history for a client")

}

//#endregion

/************** PATCH Endpoint Handling Methods ****************/
//#region GET Endpoint Handling

module.exports.handleModifySpecificClientWorkout = function(request, response) {
  
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

// Gets a client training session from the database
function getClientTrainingSessionsFromDb(id, callback){

  console.log("Now getting training sessions assigned to client " + id + " from the database")
  
  var sql = "SELECT ts.id AS session_id, json_build_object('session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'session_sets', ts.sessionSets, 'session_reps', ts.sessionreps, 'session_active_flag',ts.active, 'exercises', json_agg(json_build_object('exercise_id', e.id, 'exercise_name', e.name, 'exercise_muscle_group', mg.name, 'exercise_instruction', e.instruction, 'exercise_active_flag', e.active))) session_details FROM client AS c JOIN client_training_session AS cts ON cts.clientid = c.id JOIN training_session AS ts ON ts.id = cts.sessionid JOIN session_exercises AS se ON se.sessionid = ts.id JOIN exercises AS e on e.id = se.exerciseid JOIN muscle_group AS mg ON mg.id = e.musclegroup WHERE c.id = $1::int GROUP BY ts.id;";

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
} // end of getClientDataFromDb

// Gets all workouts done by a client
function getClientWorkoutHistoryFromDb(id, callback) {

  console.log("Now getting workout sessions done by client " + id + " from the database")
  
  var sql = "SELECT cwh.id AS client_workout_history_session_id, json_build_object('session_id', ts.id, 'session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'exercises_performed', json_agg(json_build_object('exercise_id', e.id, 'exercise_name', e.name, 'exercise_sets', cwhe.sets, 'exercise_reps', cwhe.reps, 'exercise_weight', cwhe.weight, 'exercise_seconds', cwhe.seconds))) workout_details FROM client_workout_history AS cwh JOIN client_workout_history_exercises AS cwhe ON cwhe.workouthistoryid = cwh.id JOIN exercises AS e ON e.id = cwhe.exerciseid JOIN training_session AS ts ON ts.id = cwh.sessionid JOIN client AS c ON c.id = cwh.clientid WHERE c.id = $1::int GROUP BY cwh.id, ts.id;";

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

  // Gets all workouts done by a client
function getSpecificClientWorkoutHistoryFromDb(id, callback) {

  console.log("Now getting workout sessions done by client " + id + " from the database")
  
  var sql = "SELECT cwh.id AS client_workout_history_session_id, json_build_object('session_id', ts.id, 'session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'exercises_performed', json_agg(json_build_object('exercise_id', e.id, 'exercise_name', e.name, 'exercise_sets', cwhe.sets, 'exercise_reps', cwhe.reps, 'exercise_weight', cwhe.weight, 'exercise_seconds', cwhe.seconds))) workout_details FROM client_workout_history AS cwh JOIN client_workout_history_exercises AS cwhe ON cwhe.workouthistoryid = cwh.id JOIN exercises AS e ON e.id = cwhe.exerciseid JOIN training_session AS ts ON ts.id = cwh.sessionid JOIN client AS c ON c.id = cwh.clientid WHERE cwh.id = $1::int GROUP BY cwh.id, ts.id;";

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
//#endregion