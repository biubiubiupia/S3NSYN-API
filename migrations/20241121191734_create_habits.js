/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.withSchema("s3nsyn").createTable("habits", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("note");
    table.integer("count").notNullable();
    table.enum("frequency", ["daily", "weekly", "monthly"]).notNullable();
    table.json("alert_times").notNullable();
    table.json("weekly_days");
    table.json("monthly_dates");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("goal_id")
      .unsigned()
      .notNullable()
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
  return knex.schema.withSchema("s3nsyn").dropTable("habits");
};
