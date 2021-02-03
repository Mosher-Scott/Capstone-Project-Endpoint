require('dotenv').config();

var express = require('express');
var app = express.Router();

const { Pool } = require('pg');
const { get, request } = require('http');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  sslmode: require,
  reject_unauthorized: true
});

/************** GET Endpoint Handling Methods ****************/
//#region GET Endpoint Handling
module.exports.handleGetExercisesData = function (request, response) {
    console.log("Now getting all exercises");

    var exerciseId = request.params.exerciseId;
    var isInt = Number.isInteger(exerciseId);

    if (!isInt) {
        console.log("Non int entered");
        response.statusCode = 404;
        response.json({success:false, data:"Something other than an integer was entered as a parameter"});
    } else {
        var basics = request.params.basics;

        // Run the method to pull data from the database
        getExerciseDataFromDb(exerciseId, function(error, result) {

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
            response.json({success:false, data:"No results found"});
            } 

            else {
            console.log("Exercises found");

            const exercises = result;

            response.status(200);

            response.setHeader('Content-Type', 'application/json');
            response.json(exercises);
            }
        }) // end of getClientDataFromDb method
    }
}

module.exports.handleGetExercisesNamesAndIds = function(request, response) {
    console.log("Now getting exercise names and ids");

    // Run the method to pull data from the database
    getExerciseNamesAndIds(function(error, result) {

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
        response.json({success:false, data:"No results found"});
        } 

        else {
        console.log("Exercises found");

        const exercises = result;

        response.status(200);

        response.setHeader('Content-Type', 'application/json');
        response.json(exercises);
        }
    }) // end of getClientDataFromDb method
}

//#endregion

/************** Database Query Methods ****************/
//#region Database Methods
// Method for returning all client data, or just single client info
function getExerciseDataFromDb(id, callback){

    console.log("Now getting exercise information from the database")
  
    var sql;
  
    // Check the exercise id.  If it is null, then return all user information
    if (id == null) {
      sql = "SELECT e.id AS exercise_id, json_build_object('exercise_name', e.name, 'muscle_group', mg.name, 'exercise_instruction', e.instruction, 'exercise_active_flag', e.active) exercise_info FROM exercises AS e JOIN muscle_group AS mg ON mg.id = e.musclegroup GROUP BY e.id, mg.name ORDER BY e.id ASC;";
  
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
      sql = "SELECT e.id AS exercise_id, json_build_object('exercise_name', e.name, 'muscle_group', mg.name, 'exercise_instruction', e.instruction, 'exercise_active_flag', e.active) exercise_info FROM exercises AS e JOIN muscle_group AS mg ON mg.id = e.musclegroup WHERE e.id = $1::int GROUP BY e.id, mg.name;";
  
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
  }; // end of getClientDataFromDb

  function getExerciseNamesAndIds(callback) {

    console.log("Now getting exercises names and ids")
    
    //var sql = "SELECT e.id AS exercise_id, json_build_object('exercise_name', e.name) exercise_info FROM exercises AS e ORDER BY e.id ASC;";

    var sql = "SELECT json_build_object('exercise_id', e.id, 'exercise_name', e.name) exercise_info FROM exercises AS e ORDER BY e.id ASC;";

    pool.query(sql, function(err, result) {
    
        if(err) {
        console.log("an error occurred")
        console.log(err)
        callback(err, null);
        } else {
        callback(null, result.rows);
        }
    
    }) // end of pool
  }; // end of getClientDataFromDb