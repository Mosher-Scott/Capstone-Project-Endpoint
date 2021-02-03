require('dotenv').config();

var express = require('express');
var app = express.Router();

const { Pool } = require('pg');
const { get, request } = require('http');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


/************** GET Endpoint Handling Methods ****************/
//#region GET Endpoint Handling
module.exports.handleGetTrainingSessiondata = function(request, response) {
    var sessionId = request.params.id;

    console.log(request.params);

  // Run the method to pull data from the database
  getClientDataFromDb(sessionId, function(error, result) {

   // console.log(result);
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
      console.log("Training Sessions found");

      const sessions = result;

      response.status(200);

      response.setHeader('Content-Type', 'application/json');
      response.json(sessions);
    }
  }) // end of DataFromDb method
}

// Gets all exercises from the database for a given training session
module.exports.handleGetTrainingSessionExercises = function(request, response) {
    var sessionId = request.params.id;

    console.log(request.params);

  // Run the method to pull data from the database
  getTrainingSessionExercisesFromDb(sessionId, function(error, result) {

    //console.log(result);
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
      console.log("Training Sessions found");

      const sessions = result;

      response.status(200);

      response.setHeader('Content-Type', 'application/json');
      response.json(sessions);
    }
  }) // end of DataFromDb method
}

// Handles getting training session Ids and names from the database
module.exports.handleGetTrainingSessionNamesAndIds = function(request, response) {
    
  // Run the method to pull data from the database
  getTrainingSessionExerciseNamesAndIdsFromDb(function(error, result) {

    //console.log(result);
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
      console.log("Training Sessions found");

      const sessions = result;

      response.status(200);

      response.setHeader('Content-Type', 'application/json');
      response.json(sessions);
    }
  }) // end of DataFromDb method
}


//#endregion

/************** Database Query Methods ****************/
//#region Database Methods
function getClientDataFromDb(id, callback) {
    console.log("Now getting training sessions from the database")

    console.log(id);
  var sql;

  // Check the user id.  If it is null, then return all user information
  if (id == null) {

        sql = "SELECT ts.id AS session_id, json_build_object('session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'session_sets', ts.sessionSets, 'session_reps', ts.sessionreps, 'session_active_flag',ts.active, 'exercises', json_agg(json_build_object('exercise_id', e.id, 'exercise_name', e.name, 'exercise_instructions', e.instruction))) session_details FROM training_session AS ts JOIN session_exercises AS se ON se.sessionid = ts.id JOIN exercises AS e on e.id = se.exerciseid GROUP BY ts.id ORDER BY ts.id ASC;";
                
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

    else {
        sql = "SELECT ts.id AS session_id, json_build_object('session_name', ts.sessionname, 'session_description', ts.sessiondescription, 'session_sets', ts.sessionSets, 'session_reps', ts.sessionreps, 'session_active_flag',ts.active, 'exercises', json_agg(json_build_object('exercise_id', e.id, 'exercise_name', e.name, 'exercise_instructions', e.instruction))) session_details FROM training_session AS ts JOIN session_exercises AS se ON se.sessionid = ts.id JOIN exercises AS e on e.id = se.exerciseid WHERE ts.id = $1::int GROUP BY ts.id ORDER BY ts.id ASC;";

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
}

function getTrainingSessionExercisesFromDb(id, callback) {
    sql = "SELECT ts.id AS training_session_id, json_agg(json_build_object('exercise_id', e.id, 'exercise_name', e.name, 'exercise_instructions', e.instruction)) exercises FROM training_session AS ts JOIN session_exercises AS se ON se.sessionid = ts.id JOIN exercises AS e on e.id = se.exerciseid WHERE ts.id = $1::int GROUP BY ts.id ORDER BY ts.id ASC;";

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

function getTrainingSessionExerciseNamesAndIdsFromDb(callback) {
  console.log("Now getting training session names and ids")
  
  var sql = "SELECT ts.id AS training_session_id, json_agg(json_build_object('training_session_name', ts.sessionname)) session_info FROM training_session AS ts GROUP BY ts.id ORDER BY ts.id ASC;";

  pool.query(sql, function(err, result) {
  
    if(err) {
    console.log("an error occurred")
    console.log(err)
    callback(err, null);
    } else {
      callback(null, result.rows);
    }
  
  }) // end of pool
} // end of getClientDataFromDb


//#endregion