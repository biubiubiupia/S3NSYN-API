import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const setReward = async (req, res) => {
  const userId = req.user.id;

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
      user_id: userId,
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
      message: `There are no rewards found for goal with ID ${goalId}`,
    });
  }

  res.status(200).json(reward);
};

const getAllRewards = async (req, res) => {
  const userId = req.user.id;

  const rewards = await knex("rewards").where("user_id", userId);

  if (!rewards) {
    return res.status(404).json({
      message: `There are no rewards found for user with ID ${userId}.`,
    });
  }

  res.status(200).json(rewards);
};

const editReward = async (req, res) => {
  const { rewardId } = req.params;

  if (!req.body) {
    return res.status(400).json({
      message: "Request body is empty. Please provide valid data.",
    });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Please include goal title and description in request body.",
    });
  }

  try {
    const rewardUpdated = await knex("rewards")
      .where({ id: rewardId })
      .update(req.body);

    if (rewardUpdated === 0) {
      return res.status(404).json({
        message: `Reward with ID ${id} not found`,
      });
    }

    const updatedReward = await knex("goals").where({ id: rewardId }).first();

    res.status(200).json(updatedReward);
  } catch (error) {
    console.error(`Error updating reward with ID ${rewardId}:`, error);
    res.status(500).json({
      message: `Unable to update reward with ID ${rewardId}: ${error.message}`,
    });
  }
};

const changePoints = async (req, res) => {
  const { habitId } = req.params;
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({
      message: "Please provide both habitId and action ('add' or 'subtract').",
    });
  }

  const habit = await knex("habits").where({ id: habitId }).first();

  const goalId = habit.goal_id;

  const reward = await knex("rewards").where({ goal_id: goalId }).first();

  if (!habit) {
    return res.status(404).json({ message: "Habit not found." });
  }
  if (!reward) {
    return res
      .status(404)
      .json({ message: "Reward not found for the associated goal." });
  }

  let pointsChange = reward.points_per_occurrence;
  if (action === "subtract") {
    pointsChange = -pointsChange;
  } else if (action !== "add") {
    return res.status(400).json({
      message: "Invalid action. Use 'add' or 'subtract'.",
    });
  }

  try {
    await knex("rewards")
      .where({ goal_id: goalId })
      .increment("points", pointsChange);

    res.status(200).json({
      message: `Reward points updated successfully. ${
        action === "add" ? "Added" : "Subtracted"
      } ${pointsChange} points.`,
    });
  } catch (error) {
    console.error("Error updating reward points:", error);
    res.status(500).json({ message: "Error updating reward points" });
  }
};

export { setReward, getOneReward, getAllRewards, editReward, changePoints };
