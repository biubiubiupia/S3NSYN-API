import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const goals = await knex("goals").where({ user_id: userId });
    res.status(200).json(goals);
  } catch (error) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

const addGoal = async (req, res) => {

  try {
    const { title, description, start, end } = req.body;

    if (!title || typeof title !== "string" || !start || !end) {
      return res
        .status(400)
        .json({ message: "Invalid input: Title, start, and end are required" });
    }

    const userId = req.user.id;

    const [insertedId] = await knex("goals").insert({
      title,
      description,
      "start-time": new Date(start),
      "end-time": new Date(end),
      user_id: userId, 
    });

    res
      .status(201)
      .json({ id: insertedId, message: "Goal created successfully" });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ message: "Error creating goal" });
  }
};

const editGoal = async (req, res) => {

}

const deleteGoal = async (req, res) => {
  const { id } = req.params;

}

export { getGoals, addGoal, editGoal, deleteGoal };
