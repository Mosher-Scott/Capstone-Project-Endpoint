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
module.exports.handleGetMuscleGroupData = function (request, response) {
    var muscleGroupId = request.params.id;

    console.log(request.params);

  // Run the method to pull data from the database
  getDataFromDb(muscleGroupId, function(error, result) {

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

//#endregion

/************** Database Query Methods ****************/
//#region Database Methods
function getDataFromDb(id, callback) {
    console.log("Now getting muscle groups from the database")

    console.log(id);
    var sql;

    // Check the user id.  If it is null, then return all user information
    if (id == null) {

        sql = "SELECT json_build_object('muscle_group_id', mg.id, 'muscle_group_name', mg.name) muscle_group_details FROM muscle_group AS mg GROUP BY mg.id ORDER BY mg.id ASC;";
                
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

//#endregion