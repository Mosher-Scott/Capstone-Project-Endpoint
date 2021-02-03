'use strict';

const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

// Set paths
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 8080;

app.use('/', express.static(path.join(__dirname, 'testheroku')));

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/public/sitedetails.html")
})

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});