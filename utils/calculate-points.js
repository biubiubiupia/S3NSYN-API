import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const allOccur = async (goal_id, goalStartTime, goalEndTime) => {
  const habits = await knex("habits").where("goal_id", goal_id);

  const totalOccur = habits.reduce((total, habit) => {
    const today = new Date();
    const habitStartTime = goalStartTime > today ? goalStartTime : today;
    let occurrences = 0;

    // Calculate occurrences based on habit frequency
    if (habit.frequency === "daily") {
      const days =
        Math.floor((goalEndTime - habitStartTime) / (1000 * 3600 * 24)) + 1;
      occurrences = days * habit.count; // Multiply by count per day
    } else if (habit.frequency === "weekly") {
      const weeks =
        Math.floor((goalEndTime - habitStartTime) / (1000 * 3600 * 24 * 7)) + 1;
      occurrences = weeks * habit.count; // Multiply by count per week
    } else if (habit.frequency === "monthly") {
      const months =
        Math.floor((goalEndTime - habitStartTime) / (1000 * 3600 * 24 * 30)) +
        1;
      occurrences = months * habit.count; // Multiply by count per month
    }

    return total + occurrences;
  }, 0);

  return totalOccur;
};

// Update Reward Points in Rewards Table
const updatePoints = async (goal_id, totalOccur) => {
  const reward = await knex("rewards").where("goal_id", goal_id).first();
  if (!reward) throw new Error("Reward not found");

  const pointsPerOccur = totalOccur ? reward.points / (totalOccur * 0.75) : 0;

  await knex("rewards")
    .where("goal_id", goal_id)
    .update({ points_per_occurrence: pointsPerOccur });
  return pointsPerOccur;
};

export { allOccur, updatePoints };
