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

app.get('/api/v1/users', (request, response) => {
  database('users').select()
    .then((users) => (
      response.status(200).json(users)
    ))
    .catch((error) => (
      response.status(500).json({error})
    ));
});

app.post('/api/v1/users', (request, response) => {
  const user = request.body;

  for (let requiredParameters of [
    'first_name',
    'last_name'
  ]) {
    if (!user[requiredParameters]) {
      return response
        .status(422)
        .send({error: `Expected format: { name: <String> }. 
        You're missing a "${requiredParameters}" property.`});
    }
  }
  database('users').insert(user, 'id')
    .then(user => (
      response.status(201).json({ id: user[0] })
    ))
    .catch(error => (
      response.status(500).json({ error })
    ));
});

app.delete('/api/v1/users', (request, response) => {
  database('users').where('id', request.params.id).del()
    .then(user => user);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;