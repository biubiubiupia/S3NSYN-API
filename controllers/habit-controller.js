import initKnex from "knex";
import configuration from "../knexfile.js";
import { allOccur, updatePoints } from "../utils/calculate-points.js";
const knex = initKnex(configuration);

// Fetch Goal End Time
const getEndTime = async (goal_id) => {
  const goal = await knex("goals").where("id", goal_id).first();
  if (!goal) throw new Error("Goal not found");
  return new Date(goal.end_time); // Convert to Date object
};

// Add Habit Function
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

  if (!title || !frequency || !count) {
    return res.status(400).json({
      message: "Missing required fields: title, frequency, or count.",
    });
  }

  try {
    const goalEndTime = await getEndTime(goal_id);
    const goalStartTime = new Date();

    // Insert the new habit
    await knex("habits").insert({
      user_id,
      title,
      count,
      frequency,
      weekly_days: JSON.stringify(selectedDays) || null,
      monthly_dates: JSON.stringify(selectedDates) || null,
      alert_times: JSON.stringify(times),
      goal_id,
    });

    // Fetch all habits and calculate total occurrences
    const { totalOccur } = await allOccur(goal_id, goalStartTime, goalEndTime);

    // Update reward points in the rewards table
    await updatePoints(goal_id, totalOccur);

    res.status(201).json({ message: "Habit added successfully!" });
  } catch (error) {
    console.error("Error adding habit:", error);
    res.status(500).json({ message: "Error adding habit." });
  }
};

// Edit Habit Function
const editHabit = async (req, res) => {
  const habitId = req.params.habitId;
  const { title, frequency, count, selectedDays, selectedDates, times } =
    req.body;

  if (!title || !frequency || count == null) {
    return res.status(400).json({
      error: "Missing required fields: title, frequency, or count.",
    });
  }

  try {
    const habitExists = await knex("habits").where({ id: habitId }).first();
    if (!habitExists) {
      return res.status(404).json({ error: "Habit not found." });
    }

    // Update the habit first
    const updatedHabit = {
      title,
      frequency,
      count,
      weekly_days: JSON.stringify(selectedDays),
      monthly_dates: JSON.stringify(selectedDates),
      alert_times: JSON.stringify(times),
      updated_at: knex.fn.now(),
    };

    await knex("habits").where("id", habitId).update(updatedHabit);

    // Fetch the goal's end time
    const goalEndTime = await getEndTime(habitExists.goal_id);
    const goalStartTime = new Date();

    // Fetch all habits (including the updated one) and calculate total occurrences
    const totalOccur = await allOccur(
      habitExists.goal_id,
      goalStartTime,
      goalEndTime
    );

    console.log(totalOccur);

    // Update reward points in the rewards table
    await updatePoints(habitExists.goal_id, totalOccur);

    // Respond with the updated habit
    const updatedHabitData = await knex("habits")
      .where({ id: habitId })
      .first();
    res.status(200).json(updatedHabitData);
  } catch (error) {
    console.error("Error editing habit:", error);
    res
      .status(500)
      .json({ error: "An error occurred while editing the habit." });
  }
};

const getTodayHabits = async (req, res) => {
  const userId = req.user.id; // Assumes user is authenticated and `req.user` is set

  const filterTodayHabits = (habits) => {
    const today = new Date();
    const todayDate = today.getDate();
    const todayDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const todayMonth = today.getMonth(); // 0 = January, 1 = February, ..., 11 = December
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      todayMonth + 1,
      0
    ).getDate();

    return habits.filter((habit) => {
      if (habit.frequency === "daily") {
        return true; // Daily habits always occur
      }

      if (habit.frequency === "weekly") {
        const weeklyDays = habit.weekly_days;
        return weeklyDays.includes(todayDayIndex); // Check if today is in the habit's weekly_days
      }

      if (habit.frequency === "monthly") {
        const monthlyDates = habit.monthly_dates;
        return (
          monthlyDates.includes(todayDate) || // Check if today is in the habit's monthly_dates
          (todayDate === lastDayOfMonth &&
            monthlyDates.some((date) => date > lastDayOfMonth)) // Handle 29th, 30th, 31st
        );
      }

      return false; // Exclude habits that don't match the frequency criteria
    });
  };

  try {
    // Fetch habits from the database
    const habits = await knex("habits").where({ user_id: userId });

    // Filter habits for today
    const todayHabits = filterTodayHabits(habits);

    if (todayHabits.length > 0) {
      return res.status(200).json(todayHabits); // Send back the habits for today
    } else {
      return res.status(404).json({ message: "No habits for today found." });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching habits." });
  }
};

const getHabits = async (req, res) => {
  const goalId = req.params.goalId;

  try {
    const habits = await knex("habits").where({ goal_id: goalId });
    res.status(200).json(habits);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to fetch habits for goal with ID ${goalId}` });
  }
};

const getOneHabit = async (req, res) => {
  const habitId = req.params.habitId;

  try {
    const habit = await knex("habits").where({ id: habitId }).first();
    res.status(200).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch habit with ID ${habitId}` });
  }
};

export { addHabit, getTodayHabits, getHabits, getOneHabit, editHabit };
