import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const addHabit = async (req, res) => {
  const {
    title,
    frequency,
    count,     
    selectedDays,
    selectedDates,
    times,
    goal_id,
  } = req.body;
  const user_id = req.user.id;
  const alert_times = JSON.stringify(times);
  const weekly_days= selectedDays.length? JSON.stringify(selectedDays): null;
  const monthly_dates= selectedDates.length? JSON.stringify(selectedDates): null;

  if (!title || !frequency) {
    return res.status(400).json({
      message: "Invalid input: title, count, and frequency are required",
    });
  }

  try {
    await knex("habits").insert({
      user_id,
      title,
      frequency,
      weekly_days,
      monthly_dates,
      alert_times,
      goal_id
    });
    res.status(201).json({ message: "Habit saved successfully!" });
  } catch (error) {
    console.error("Error saving habit:", error);
    res.status(500).json({ message: "Error saving habit" });
  }
};

const getHabits = async (req, res) => {
  const goalId = req.params.goalId;

  try {
    const habits = await knex("habits").where({ goal_id: goalId });
    res.status(200).json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch habits for goal with ID ${goalId}` });
  }
}

const getOneHabit = async (req, res) => {
  const habitId = req.params.habitId;

  try {
    const habit = await knex("habits").where({ id: habitId }).first();
    res.status(200).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch habit with ID ${habitId}` });
  }
}

const editHabit = async (req, res) => {
  const habitId = req.params.habitId;
}

export { addHabit, getHabits, getOneHabit, editHabit };
