import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const createAccount = async (req, res) => {
  // try {
  //   const data = await knex("inventories").orderBy(sortBy, order);
  //   res.status(200).json(data);
  // } catch (err) {
  //   res.status(400).send(`Error retrieving warehouses: ${err}`);
  // }
};

const login = async (req, res) => {
    // try {
    //   const sortBy =
    //     req.query.sortBy ||
    //     "item_name" ||
    //     "category" ||
    //     "status" ||
    //     "warehouse_id";
    //   const order = req.query.order || "asc";
    //   let query = knex("inventories");
    //   if (sortBy && sortBy !== "no_sort") {
    //     query = query.orderBy(sortBy, order);
    //   }
    //   const data = await knex("inventories").orderBy(sortBy, order);
    //   res.status(200).json(data);
    // } catch (err) {
    //   res.status(400).send(`Error retrieving warehouses: ${err}`);
    // }
  };

export { createAccount, login };
