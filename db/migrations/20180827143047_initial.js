
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('first_name');
    table.string('last_name');

    table.timestamps(true, true);
  }),

  knex.schema.createTable('saved_routes', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('start_location');
    table.string('end_location');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');

    table.timestamps(true, true);
  })
]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('saved_routes'),
    knex.schema.dropTable('users')
  ]);