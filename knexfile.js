import "dotenv/config";
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
  },
  migrations: {
    directory: './migrations',
  },
};