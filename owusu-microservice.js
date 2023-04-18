"use strict";

const dotenv = require("dotenv")
dotenv.config()

const PORT = process.env.PORT || 8071

const logger = require("./logger")

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

app.use(httpLogger)

app.get('/', function (_req, res) {
    logger.debug('This is the "/" route.')
    logger.info("Welcome to the Owusu Micro-service")
    res.send('Welcome to the Owusu Micro-service');
});

app.get("/trace", async (_req, res) => {
    logger.debug('This is the "/trace" route.')
    logger.info("Calling Esquire Micro-service...")
    await axios({
      method: 'GET',
      url: 'https://gateway.siobytes.com/esquire/trace' 
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
      logger.debug('This is the "/trace" route.')
    }); 
});

app.use(function(_req, res) {
  logger.debug('This is for erroneous route.')
  logger.info("Sorry, that route doesn't exist. Have a nice day :)")
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
})

// app.listen(parseInt(PORT, 10), () => {
//   console.log(`Listening for requests on http://localhost:${PORT}`);
//   logger.info("Starting server.... Process initialized!");
// });

// process.on("SIGTERM", () => {
//   app.close(() => {
//     logger.info("Stopping server.... Process terminated!");
//     console.log("Process terminated");
//   });
// });


const server = app.listen(parseInt(PORT, 10), () =>
  console.log(`Listening at port ${PORT}`),
  logger.info("Starting server.... Process initialized!"),
  console.log("Starting server.... Process initialized!")
  )
module.exports = server

process.on("SIGTERM", () => {
  server.close(() => {
    logger.info("Stopping server.... Process terminated!")
    console.log("Process terminated")
  })
})