// For routing exercise requests
var express = require('express');
var app = express.Router();

const methods = require('./muscleGroupsFunctions');

app.get("/:muscleGroupId?", methods.handleGetMuscleGroupData)

module.exports = app;