const knex = require('./knex');

const Users = () => {
  return knex('users');
};

const getAll = () => {
  return Users().select();
};

const getSingle = (userId) => {
  return Users().where('id', parseInt(userId)).first();
};

const add = (user) => {
  return Users().insert(user, 'id');
};

const deleteUser = (userId) => {
  return Users().where('id', parseInt(userId)).del();
};

module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  add: add,
  deleteUser: deleteUser
};