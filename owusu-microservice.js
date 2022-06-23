"use strict";

const dotenv = require("dotenv");
dotenv.config();

// const instrument = require("@aspecto/opentelemetry");
// const aspectoAuth = process.env.ASPECTO_API_KEY;

const logger = require("./logger");

// const { setLogger } = instrument({
//   local: true,
//   logger,
//   aspectoAuth,
//   serviceName: "simon-microservice",
//   env: "Production",
//   writeSystemLogs: true,
//   // exportBatchSize: 100,
//   samplingRatio: 1.0,
//   disableAspecto: false,
// });

// setLogger(logger);

const express = require("express");
const app = express();

const axios = require('axios');

const httpLogger = require('./httpLogger')

const PORT = process.env.PORT;

app.use(httpLogger)

app.get('/', function (_req, res) {
    logger.debug('This is the "/" route.')
    logger.info("Welcome to the Owusu Micro-service")
    res.send('Welcome to the Owusu Micro-service');
});

app.get("/owusu", async (_req, res) => {
    logger.debug('This is the "/owusu" route.')
    logger.info("Calling Esquire Micro-service...")
    await axios({
      method: 'GET',
      url: 'http://192.168.0.9:3002/esquire'
    })
    .then(function (response) {
      logger.info('Calling Esquire Service...')
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end('Calling Esquire Service...')
      console.log(response);
    })
    .catch(function (error) {
      logger.error('Failed to call Esquire Service...')
      logger.error('Application Error - ', error)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end('Failed to call Esquire Service...')
      console.log(error);
    })
    .then(function () {
      logger.debug('This is the "/esquire" route.')
    }); 
});

app.get("/go", async (_req, res) => {
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
      logger.debug('This is the "/go" route.')
    }); 
    
});

app.use(function(_req, res) {
  logger.debug('This is for erroneous route.')
  logger.info("Sorry, that route doesn't exist. Have a nice day :)")
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
  logger.info("Starting server.... Process initialized!");
});

process.on("SIGTERM", () => {
  app.close(() => {
    logger.info("Stopping server.... Process terminated!");
    console.log("Process terminated");
  });
});

