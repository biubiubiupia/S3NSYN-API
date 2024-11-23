/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("rewards", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table.integer("points").notNullable();
    table.timestamp("start-time").defaultTo(knex.fn.now());
    table.timestamp("end-time");
    table
      .integer("goal_id")
      .unsigned()
      .references("id")
      .inTable("goals")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
    return knex.schema.dropTable("rewards");
  };