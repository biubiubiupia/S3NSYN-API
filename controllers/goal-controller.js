import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jwt from "jsonwebtoken";
import authenticate from "../middleware/authenticate.js";

const getGoals = async (req, res) => {
    const userId = req.user.id;

    try {
        const goals = await knex('goals').where({ user_id: userId });
        res.status(200).json(goals);
    } catch (error) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
};

export default getGoals;
