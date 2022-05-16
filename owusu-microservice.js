// Require express and create an instance of it
const express = require("express");
const app = express();

// const { countAllRequests } = require("./monitoring");
// app.use(countAllRequests());

const axios = require('axios');

// on the request to root (localhost:3000/)
app.get('/', function (req, res) {
    res.send('Welcome to the Owusu Micro-service');
});

app.get("/owusu", async (req, res) => {

    const result = await axios({
      method: 'GET',
      url: 'http://192.168.0.9:3002/esquire'
    })
    return res.status(200).send({ message: "Calling Esquire Micro-service..." });
});

app.get("/go", async (req, res) => {
    // logger.debug('This is the "/go" route.')
    // logger.info("Calling Golang Service...")

    const result = await axios({
      method: 'GET',
      url: 'http://192.168.0.9:4000/go'
    })
    return res.status(200).send({ message: "Calling Golang Service..." });
});

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3001 !
app.listen(3001, function () {
    console.log('Owusu Service is listening on port 3001.');
});
