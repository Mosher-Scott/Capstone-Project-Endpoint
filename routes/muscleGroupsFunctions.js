require('dotenv').config();

var express = require('express');
var app = express.Router();

const { Pool } = require('pg');
const { get, request } = require('http');
const { Console } = require('console');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/************** GET Endpoint Handling Methods ****************/
//#region GET Endpoint Handling
module.exports.handleGetMuscleGroupData = function (request, response) {
    
  var muscleGroupId = request.params.muscleGroupId;

  // Run the method to pull data from the database
  getDataFromDb(muscleGroupId, function(error, result) {

   // console.log(result);
    if (error || result == "undefined") {
      console.log("Either an error or result was undefined");
      response.statusCode = 404;
      response.json({success:false, data:"Either an error or result was undefined"});
    }

    else if (result === null ) {
      console.log ("null result");
      response.statusCode = 404;
      response.json({success:false, data:"Nothing found"});
    }

    // If query ran successfully but there was no results
    else if (result.length == 0) {
      console.log("No results returned");
      response.statusCode = 204;
      response.json({success:false, data:"Nothing found"});
      response.end();
    } 

    else {
      console.log("Muscle Group found");

      const muscleGroup = result;

      response.status(200);
      response.setHeader('Content-Type', 'application/json');
      response.json(muscleGroup);
    }
  }) // end of DataFromDb method
}

//#endregion

/************** Database Query Methods ****************/
//#region Database Methods
function getDataFromDb(id, callback) {
    console.log("Now getting muscle groups from the database")

    var sql;

    // Check the muscle group id.  If it is null, then return all user information
    if (id == null) {

        sql = "SELECT mg.id, mg.name muscle_group_details FROM muscle_group AS mg GROUP BY mg.id ORDER BY mg.id ASC;";
                
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
        sql = "SELECT mg.id, mg.name FROM muscle_group AS mg WHERE mg.id = $1::int;";

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