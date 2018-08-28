const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'BYOB';
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.users = [{"name": "Quin"}, {"name": "Hill"}, {"name": "Andrew"}];

app.get('/api/v1/users', (request, response) => {
  const users = app.locals.users;
  return response.status(200).json(users);
});

app.post('/api/v1/users', (request, response) => {
  const user = request.body;
  app.locals.users.push(user);
  return response.status(201).json(user);
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;