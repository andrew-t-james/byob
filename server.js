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





app.get('/api/v1/saved_routes', (request, response) => {
  database('saved_routes').select()
    .then(savedRoutes => response.status(200).json(savedRoutes))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/saved_routes/:user_id', (request, response) => {
  const { user_id } = request.params;

  database('saved_routes').where('user_id', user_id).select()
    .then(favorites => {
      if (favorites.length) {
        return response.status(200).json(favorites);
      }
      return response.status(404).json({error: '404: Resource not found'});
    })
    .catch(() => response.status(500).send({'Error':'500: Internal server error.'}));
});

const savedRoutesPostErrorHandling = (request, response, next) => {
  const expectedParams = ['name', 'start_location', 'end_location'];
  const newRoute = {
    ...request.body
  };


  for (const requiredParams of expectedParams) {
    if (!newRoute[requiredParams]) {
      return response.status(422).json({
        error: `Expected format: { property: <String> }. You're missing a ${requiredParams} property.`
      });
    }
  }
  next();
};


app.post('/api/v1/saved_routes/:user_id', savedRoutesPostErrorHandling, (request, response) => {
  const routeToSave = request.body;
  const { user_id } = request.params;
  console.log('user_id', user_id);

  database('saved_routes').select('users').where('user_id', user_id).insert(routeToSave, '*')
    .then(newRoute => {
      console.log(newRoute);
      return response.status(201).json(newRoute);
    })
    .catch(error => response.status(500).json({ error: 'Internal Server Error' }));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;