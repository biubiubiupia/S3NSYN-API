import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jwt from "jsonwebtoken";
import authenticate from "../middleware/authenticate.js";

const setReward = async (req, res) => {
  try {
    const { title, description, goal_id } = req.body;
    if (!title || !goal_id) {
      return res
        .status(400)
        .json({ message: "Invalid input: reward title and id are required" });
    }

    const goal = await knex("goals").where("id", goal_id).first();

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const [insertedId] = await knex("rewards").insert({
      title,
      description,
      points: 1000,
      start_time: goal.start_time,
      goal_id,
    });

    res
      .status(201)
      .json({ id: insertedId, message: "Reward created successfully" });
  } catch (error) {
    console.error(error);
  }
};

const getOneReward = async (req, res) => {
  const { goalId } = req.params;

  const reward = await knex("rewards").where("goal_id", goalId).first();

  if (!reward) {
    return res.status(404).json({
      message: `Reward with ID ${id} does not exist.`,
    });
  }

  res.status(200).json(reward);
};

const getRewards = async (req, res) => {
  const { goalId } = req.params;

  const reward = await knex("rewards").where("goal_id", goalId).first();

  if (!reward) {
    return res.status(404).json({
      message: `Reward with ID ${id} does not exist.`,
    });
  }

  res.status(200).json(reward);
};

const deleteReward = async (req, res) => {
  const { id } = req.params;

  try {
    const reward = await knex("rewards").where("id", id).first();

    if (!reward) {
      return res.status(404).json({
        message: `Reward with ID ${id} does not exist.`,
      });
    }

    await knex("rewards").where("id", id).del();

    res.status(204).send("Reward deleted successfully!");
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete reward with ID ${id}: ${error}`,
    });
  }
};

export { setReward, getOneReward, getRewards, deleteReward };
