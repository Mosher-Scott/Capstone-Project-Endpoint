// For handling requests to /trainingsessions
var express = require('express');
var app = express.Router();

const methods = require('./trainingsessionFunctions');

//#region Active Endpoints
app.get("/:id?", methods.handleGetTrainingSessiondata);

app.get("/:id/exercises", methods.handleGetTrainingSessionExercises);

app.get("/basics/names", methods.handleGetTrainingSessionNamesAndIds);

//#endregion

module.exports = app;