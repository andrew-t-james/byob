
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('saved_routes', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('start_location');
      table.string('end_location');
      table.integer('user_id').unsigned()
      table.foreign('user_id')
        .references('users.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('saved_routes'),
    knex.schema.dropTable('users')
  ])
};