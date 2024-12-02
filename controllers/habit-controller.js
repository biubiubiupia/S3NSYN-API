import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const addHabit = async (req, res) => {
  const {
    title,
    frequency,
    selectedDays,
    dates,
    times,
    weekly_days,
    monthly_dates,
  } = req.body;
  const user_id = req.user.id;
  console.log(req.user.id)
  const alert_times = JSON.stringify(times);

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
      alert_times,
    });
    res.status(201).json({ message: "Habit saved successfully!" });
  } catch (error) {
    console.error("Error saving habit:", error);
    res.status(500).json({ message: "Error saving habit" });
  }
};

const addGoal = async (req, res) => {
  try {
    const { title, description, start_time, end_time } = req.body;

    if (!title || typeof title !== "string" || !start_time || !end_time) {
      return res.status(400).json({
        message: "Invalid input: title, start_time, and end_time are required",
      });
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

export { addHabit };
