/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("rewards", (table) => {
    // for MySQL, uncomment the line below: 
    // table.increments("id").primary(); 
    // for PostgreSQL
    table.serial("id").primary(); 
    table.string("title").notNullable();
    table.text("description");
    table.integer("points").notNullable();
    table.bigint("start_time")
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
export const down = function (knex) {
    return knex.schema.dropTable("rewards");
  };
