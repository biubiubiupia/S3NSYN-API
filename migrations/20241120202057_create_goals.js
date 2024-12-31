/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.withSchema("s3nsyn").createTable("goals", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table.bigint("start_time");
    table.bigint("end_time");
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.withSchema("s3nsyn").dropTable("goals");
};
