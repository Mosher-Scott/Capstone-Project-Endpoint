// For routing exercise requests
var express = require('express');
var app = express.Router();

const methods = require('./exerciseFunctions');

app.get("/:exerciseId?", methods.handleGetExercisesData);

app.get("/basics/names", methods.handleGetExercisesNamesAndIds);

module.exports = app;