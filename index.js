const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./database');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// Get all Saving records
app.post('/api/savings', (request, response) => {
  database.getSavings(request.body)
  .then(data => {
    response.send(data);
  })
})

// Store new Saving record
app.post('/api/user/savings', (request, response) => {
  database.saveSavingItem(request.body)
  .then(data => {
    response.send(data);
  })
})

// Update a Saving record
app.put('/api/user/savings', (request, response) => {
  // console.log('this is request.body', request.body);
  database.updateSavings(request.body, () => {
    response.end();
  })
})

app.get('/*', (request, response) => {
  response.end('Service ready');
})

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});