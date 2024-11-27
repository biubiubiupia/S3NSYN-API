import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jwt from "jsonwebtoken";
import authenticate from "../middleware/authenticate.js";

const setReward = async (req, res) => {

    const { title, description } = req.body;


}

export default setReward;
