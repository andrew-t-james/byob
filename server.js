const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'BYOB';
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('secretKey', process.env.SECRET_KEY);
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(403).json({'error': 'You must be authorized to hit this endpoint.'});
  }

  jwt.verify(token, app.get('secretKey'), (error, decode) => {
    const userEmail = decode.user.email;
    const regex = (/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(turing)\.io$/g);

    if (error) {
      return res.status(403).json({'error': `Oops we got an error: ${error}`});
    }

    if (!regex.test(userEmail)) {
      return res.status(403).json({'error': 'You are not authorized to complete this transaction.'});
    }
    next();
  });
};

app.get('/api/v1/users', (request, response) => {
  database('users').select()
    .then((users) => (
      response.status(200).json(users)
    ))
    .catch((error) => (
      response.status(500).json({error})
    ));
});

app.get('/api/v1/users/:id', (request, response) => {
  const { id } = request.params;

  database('users').where('id', id).select()
    .then(user => {
      if (user.length) {
        return response.status(200).json(user);
      }
      return response.status(404).json({error: '404: User not found'});
    })
    .catch(() => (
      response.status(500).send({'Error': '500: Internal server error'})
    ));
});

app.post('/api/v1/users', (request, response) => {
  const user = request.body;

  for (let requiredParameters of ['first_name', 'last_name']) {
    if (!user[requiredParameters]) {
      return response
        .status(404)
        .send({error: `Expected format: { name: <String> }.
        You're missing a "${requiredParameters}" property.`});
    }
  }
  database('users').insert(user, 'id')
    .then(user => {
      return response.status(201).json({id: user[0]});
    })
    .catch(error => (
      response.status(500).json({ error })
    ));
});

app.patch('/api/v1/users/:id', (request, response) => {
  const { id } = request.params;

  database('users').where('id', id).update(request.body)
    .then(updated => {
      if (!updated) {
        return response.status(422).json({error: '422: Please provide a valid user id'});
      }
      return response.status(201).json(updated);
    })
    .catch(error => (
      response.status(500).json({error: `500: Internal server error: ${error}`})
    ));
});

app.get('/api/v1/saved_routes', (request, response) => {
  database('saved_routes').select()
    .then(savedRoutes => response.status(200).json(savedRoutes))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/saved_routes/:user_id', checkAuth, (request, response) => {
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

const savedRoutesErrorHandling = (request, response, next) => {
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


app.post('/api/v1/saved_routes/:user_id', savedRoutesErrorHandling, checkAuth, (request, response) => {
  const routeToSave = {
    ...request.body,
    user_id: request.params.user_id
  };

  database('saved_routes').insert(routeToSave, '*')
    .then(newRoute => {
      if (!newRoute[0].user_id) {
        return response.status(400).json({error: 'Please provide a correct user_id'});

      }
      return response.status(201).json(newRoute);
    })
    .catch(error => response.status(500).json({ error: `Internal Server Error: ${error}`}));
});

app.patch('/api/v1/saved_routes/:saved_route_id', checkAuth, (request, response) => {
  const { saved_route_id } = request.params;

  const propsToUpdate = {
    name: request.body.name,
    start_location: request.body.start_location,
    end_location: request.body.end_location
  };

  database('saved_routes').where('id', saved_route_id).update(propsToUpdate)
    .then(updated => {
      if (!updated) {
        return response.status(422).json({error: '422: Please provide a valid route id.'});
      }
      return response.status(201).json(updated);
    })
    .catch(error => response.status(500).json({error: `500: Internal Server Error: ${error}`}));
});

app.delete('/api/v1/saved_routes/:saved_route_id', checkAuth, (request, response) => {
  const { saved_route_id } = request.params;

  database('saved_routes').where('id', saved_route_id).del()
    .then(foundId => {
      if (!foundId) {
        return response.status(422).json({error: '422: No entry exists with that id.'});
      }
      return response.status(200).json(foundId);
    })
    .catch(error => response.status(500).json({error: `500: Internal Server Error: ${error}`}));
});

app.post('/api/v1/authorization', (request, response) => {
  const user = request.body;

  for (const requiredParam of ['email', 'app_name']) {
    if (!user[requiredParam]) {
      return response.status(422).json({
        error: `Expected format: { property: <String> }. You're missing a ${requiredParam} property.`
      });
    }
  }

  const token = jwt.sign({
    user
  }, app.get('secretKey'), { expiresIn: '48h' });


  response.status(201).json({token});
});

app.listen(app.get('port'), () => {
  /* eslint-disable */
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;