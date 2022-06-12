// Require express and create an instance of it
const express = require("express");
const app = express();

// const { countAllRequests } = require("./monitoring");
// app.use(countAllRequests());

const axios = require('axios');

const logger = require('./logger')
// const { configFromPath } = require('./util');
const httpLogger = require('./httpLogger')

app.use(httpLogger)

app.get('/', function (req, res) {
    logger.debug('This is the "/" route.')
    logger.info("Welcome to the Owusu Micro-service")
    res.send('Welcome to the Owusu Micro-service');
});

app.get("/owusu", async (req, res) => {
    logger.debug('This is the "/owusu" route.')
    logger.info("Calling Esquire Micro-service...")
    const result = await axios({
      method: 'GET',
      url: 'http://192.168.0.9:3002/esquire'
    })
    return res.status(200).send({ message: "Calling Esquire Micro-service..." });
});

app.get("/go", async (req, res) => {
    logger.debug('This is the "/go" route.')
    logger.info("Calling Golang Service...")

    await axios({
      method: 'GET',
      url: 'http://192.168.0.9:4000/go'
    })
    .then(function (response) {
      logger.info('Calling Golang Service...')
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end('Calling Golang Service...')
      console.log(response);
    })
    .catch(function (error) {
      logger.error('Failed to call Golang Service...')
      logger.error('Application Error - ', error)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end('Failed to call Golang Service...')
      console.log(error);
    })
    .then(function () {
      // always executed
      logger.debug('This is the "/simon" route.')
    }); 
    
});

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    logger.debug('This is for erroneous route.')
    logger.info("Sorry, that route doesn't exist. Have a nice day :)")
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3001 !
app.listen(3001, function () {
    console.log('Owusu Service is listening on port 3001.');
});
