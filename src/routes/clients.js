// For routing client requests
var express = require('express');
var app = express.Router();

const methods = require('./clientFunctions');

//#region Active endpoints
// Get all users, or if userId is supplied get individual client
app.get("/:userId?", methods.handleGetAllClientData);

// TODO: This 
// Add a new user 
app.post("/", methods.handleAddNewClient);

// TODO: This
// Update a user
app.patch("/", methods.handleAddNewClient);

// Get training sessions assigned to a specific user
app.get("/:userId/trainingsessions", methods.handleGetClientTrainingSessions);

// TODO: This 
// Add a new training session to a user
app.post("/:userId/trainingsessions/:trainingSessionId", methods.handleAddClientTrainingSessions);

// TODO: This
// remove a training session from a user
//app.patch("/:userId/trainingsessions/:trainingSessionId", methods.handleRemoveTrainingSessionFromUser);

// Get workout history for a specific clientId
app.get("/:userId/workouthistory", methods.handleGetClientWorkouts);

// Get a specific workout for a given clientId
app.get("/workouthistory/:workoutId", methods.handleGetSpecificClientWorkout);

// TODO: This
//app.post("/workouthistory/:workoutId", methods.handleAddClientWorkout);

// TODO: this
//app.patch("/workouthistory/:workoutId", methods.handleModifySpecificClientWorkout);

//#endregion

// Routes created, but not used, such as POST/Delete/etc
//#region Unused Routes

// PUT for clients.  Using PATCH
app.put("/", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// Delete for clients.  Using PATCH since we just need to set the active flag
app.delete("/:userId", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// PUT for client training sessions
app.put("/:userId/trainingsessions", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// DELETE for client training sessions
app.delete("/:userId/trainingsessions", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// PUT for client workout history
app.put("/:userId/workouthistory", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// POST for client workout history
app.post("/:userId/workouthistory", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// PATCH for client workout history
app.patch("/:userId/workouthistory", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// DELETE for client workout history
app.delete("/:userId/workouthistory", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// PUT for client workout history
app.put("/workouthistory/:workoutId", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// POST for client workout history
app.post("/workouthistory/:workoutId", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// PATCH for client workout history
app.patch("/workouthistory/:workoutId", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

// DELETE for client workout history
app.delete("/workouthistory/:workoutId", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({error: 'Not allowed'});
});

//#endregion

module.exports = app;