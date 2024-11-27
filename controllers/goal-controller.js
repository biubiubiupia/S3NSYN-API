import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const goals = await knex("goals").where({ user_id: userId });
    res.status(200).json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

const getOneGoal = async (req, res) => {
  const goalId = req.params.goalId;

  try {
    const goal = await knex("goals").where({ id: goalId }).first();
    res.status(200).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch goal with ID ${goalId}` });
  }
};

const addGoal = async (req, res) => {
  try {
    const { title, description, start_time, end_time } = req.body;

    if (!title || typeof title !== "string" || !start_time || !end_time) {
      return res
        .status(400)
        .json({ message: "Invalid input: title, start_time, and end_time are required" });
    }

    const userId = req.user.id;

    const [insertedId] = await knex("goals").insert({
      title,
      description,
      start_time,
      end_time,
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
  try {
    const goalUpdated = await knex("goals")
      .where({ id: req.params.id })
      .update(req.body);

    if (goalUpdated === 0) {
      return res.status(404).json({
        message: `Goal with ID ${req.params.id} not found`,
      });
    }

    const updatedGoal = await knex("goals").where({
      id: req.params.id,
    });

    res.status(200).json(updatedGoal[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update goal with ID ${req.params.id}: ${error}`,
    });
  }
};

const deleteGoal = async (req, res) => {
  const { goalId } = req.params;

  try {
    const goal = await knex("goals").where("id", goalId).first();

    if (!goal) {
      return res.status(404).json({
        message: `Goal with ID ${goalId} does not exist.`,
      });
    }

    await knex("goals").where("id", goalId).first().del();

    res.status(204).send("Goal deleted successfully!");
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete goal with ID ${goalId}: ${error}`,
    });
  }
};

export { getGoals, getOneGoal, addGoal, editGoal, deleteGoal };
