exports.up = function (knex) {
  return knex.schema.createTable('pdfs', (t) => {
    t.uuid('id').primary().notNullable()
    t.dateTime('created_at').notNullable()
    t.integer('status').notNullable()
    t.text('data').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('pdfs')
}
