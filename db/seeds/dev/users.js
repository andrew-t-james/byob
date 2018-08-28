const users = require('../users-seed-data');

const createUser = (knex, user) => knex('users').insert({
  first_name: user.first_name,
  last_name: user.last_name
}, 'id')
  .then(userId => {
    const favoritesPromises = [];

    user.favorites.forEach(favorite => {
      favoritesPromises.push(
        createFavorites(knex, {
          ...favorite,
          user_id: userId[0]
        })
      );
    });

    return Promise.all(favoritesPromises);
  });

const createFavorites = (knex, favorite) => knex('saved_routes').insert(favorite);

exports.seed = (knex, Promise) => knex('saved_routes').del()
  .then(() => knex('users').del())
  .then(() => {
    const userPromises = [];

    users.forEach(user => {
      userPromises.push(createUser(knex, user));
    });

    return Promise.all(userPromises);
  })
  .catch(error => console.log(`Error seeding data: ${error}`));