/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("habits", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("note");
    table.integer("reward_points");
    table.timestamp("start-time").defaultTo(knex.fn.now());
    table.string("frequency", ["daily", "weekly", "monthly"]).notNullable();
    table.integer("daily_occurances");
    table.integer("weekly_occurances");
    table.integer("montly_occurances");
    table.json("alert_times").notNullable();
    table.json("weekly_days");
    table.json("monthly_dates");
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
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
exports.down = function (knex) {};
