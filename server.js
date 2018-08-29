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
  const users = database('users').select()
  return response(200).json(users)
})







app.get('/api/v1/favorites', (request, response) => {
  database('saved_routes').select()
  .then(favorites => response.status(200).json(favorites))
  .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/:id/favorites', (request, response) => {
  const { id } = request.params;

  database('saved_routes').where('id', id).select()
  .then(favorites => {
    if(favorites) {
      return response.status(200).json(favorites)
    }
    return response.status(404).json({error: '404: Resource not found'})
  })
  .catch(() => response.status(500).send({'Error':'500: Internal server error.'}))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;