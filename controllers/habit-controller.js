import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Helper Function: Fetch Goal End Time
const fetchGoalEndTime = async (goal_id) => {
  const goal = await knex('goals').where('id', goal_id).first();
  if (!goal) {
    throw new Error("Goal not found");
  }
  return new Date(goal.end_time); // Convert to Date object
};

// Helper Function: Calculate Habit Occurrences
const calculateHabitOccurrences = (habit, goalStartTime, goalEndTime) => {
  const today = new Date();
  const habitStartTime = goalStartTime > today ? goalStartTime : today;
  let occurrences = 0;

  // Calculate occurrences based on habit frequency
  if (habit.frequency === 'daily') {
    occurrences = Math.floor((goalEndTime - habitStartTime) / (1000 * 3600 * 24)) + 1; // Include today
  } else if (habit.frequency === 'weekly') {
    const weeks = Math.floor((goalEndTime - habitStartTime) / (1000 * 3600 * 24 * 7));
    occurrences = weeks + 1; // Include current week
  } else if (habit.frequency === 'monthly') {
    const months = Math.floor((goalEndTime - habitStartTime) / (1000 * 3600 * 24 * 30));
    occurrences = months + 1; // Include current month
  }

  return occurrences;
};

// Helper Function: Fetch All Habits and Calculate Total Occurrences
const fetchAllHabitOccurrences = async (goal_id, goalStartTime, goalEndTime) => {
  const habits = await knex('habits').where('goal_id', goal_id);
  let totalOccurrences = 0;

  const habitOccurrences = habits.map((habit) => {
    const occurrences = calculateHabitOccurrences(habit, goalStartTime, goalEndTime);
    totalOccurrences += occurrences;
    return {
      habitId: habit.id,
      occurrences,
    };
  });

  return { totalOccurrences, habitOccurrences };
};

// Helper Function: Calculate Reward Points
const calculateRewardPointsPerOccurrence = async (goal_id, totalOccurrences) => {
  const reward = await knex('rewards').where('goal_id', goal_id).first();
  if (!reward) {
    throw new Error("Reward not found");
  }

  const remainingPoints = reward.total_reward_points || 1000; // Default 1000 if no points are found
  return totalOccurrences ? remainingPoints / totalOccurrences : 0;
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
  const alert_times = JSON.stringify(times);
  const weekly_days = selectedDays.length ? JSON.stringify(selectedDays) : null;
  const monthly_dates = selectedDates.length ? JSON.stringify(selectedDates) : null;

  if (!title || !frequency) {
    return res.status(400).json({
      message: "Invalid input: title, count, and frequency are required",
    });
  }

  try {
    // Fetch the goal's end time
    const goalEndTime = await fetchGoalEndTime(goal_id);
    const goalStartTime = new Date(); // Assume the goal starts today, can adjust if needed

    // Calculate occurrences for this habit
    const thisHabitOccurrences = calculateHabitOccurrences({ frequency, count }, goalStartTime, goalEndTime);

    // Fetch all habits and calculate total occurrences
    const { totalOccurrences, habitOccurrences } = await fetchAllHabitOccurrences(goal_id, goalStartTime, goalEndTime);

    // Calculate reward points per occurrence
    const rewardPointsPerOccurrence = await calculateRewardPointsPerOccurrence(goal_id, totalOccurrences);

    // Insert the new habit
    await knex('habits').insert({
      user_id,
      title,
      count,
      frequency,
      weekly_days,
      monthly_dates,
      alert_times,
      goal_id,
      reward_points: rewardPointsPerOccurrence * thisHabitOccurrences, // Assign reward points
    });

    res.status(201).json({ message: "Habit saved successfully!" });
  } catch (error) {
    console.error("Error saving habit:", error);
    res.status(500).json({ message: "Error saving habit" });
  }
};

// Edit Habit Function
const editHabit = async (req, res) => {
  const habitId = req.params.habitId;
  const { title, frequency, count, selectedDays, selectedDates, times } = req.body;

  console.log("Received request to edit habit with ID:", habitId);
  console.log("Request body:", req.body);

  if (!title || !frequency || count == null) {
    console.log("Validation failed: Missing title, frequency, or count");
    return res.status(400).json({
      error: "Missing required fields: title, frequency, or count.",
    });
  }

  try {
    const habitExists = await knex('habits').where({ id: habitId }).first();
    if (!habitExists) {
      return res.status(404).json({ error: "Habit not found." });
    }

    // Only proceed if count or frequency have changed
    if (habitExists.count !== count || habitExists.frequency !== frequency) {
      // Fetch the goal's end time
      const goalEndTime = await fetchGoalEndTime(habitExists.goal_id);
      const goalStartTime = new Date(); // Assume the goal starts today, can adjust if needed

      // Calculate occurrences for this habit
      const thisHabitOccurrences = calculateHabitOccurrences({ frequency, count }, goalStartTime, goalEndTime);

      // Fetch all habits and calculate total occurrences
      const { totalOccurrences, habitOccurrences } = await fetchAllHabitOccurrences(habitExists.goal_id, goalStartTime, goalEndTime);

      // Calculate reward points per occurrence
      const rewardPointsPerOccurrence = await calculateRewardPointsPerOccurrence(habitExists.goal_id, totalOccurrences);

      // Update the habit with new values and reward points, but keep the goal_id from the existing habit
      await knex('habits').where('id', habitId).update({
        title,
        frequency,
        count,
        weekly_days: JSON.stringify(selectedDays),
        monthly_dates: JSON.stringify(selectedDates),
        alert_times: JSON.stringify(times),
        reward_points: rewardPointsPerOccurrence * thisHabitOccurrences, // Update reward points
        updated_at: knex.fn.now(),
      });

      const updatedHabit = await knex('habits').where('id', habitId).first();
      res.status(200).json(updatedHabit);
    } else {
      console.log("No changes detected in habit.");
      res.status(400).json({ message: "No changes detected in habit." });
    }
  } catch (error) {
    console.error("Error editing habit:", error);
    res.status(500).json({ error: "An error occurred while editing the habit." });
  }
};

// const addHabit = async (req, res) => {
//   const {
//     title,
//     frequency,
//     count,
//     selectedDays,
//     selectedDates,
//     times,
//     goal_id,
//   } = req.body;
//   const user_id = req.user.id;
//   const alert_times = JSON.stringify(times);
//   const weekly_days = selectedDays.length ? JSON.stringify(selectedDays) : null;
//   const monthly_dates = selectedDates.length
//     ? JSON.stringify(selectedDates)
//     : null;

//   if (!title || !frequency) {
//     return res.status(400).json({
//       message: "Invalid input: title, count, and frequency are required",
//     });
//   }

//   try {
//     await knex("habits").insert({
//       user_id,
//       title,
//       count,
//       frequency,
//       weekly_days,
//       monthly_dates,
//       alert_times,
//       goal_id,
//     });
//     res.status(201).json({ message: "Habit saved successfully!" });
//   } catch (error) {
//     console.error("Error saving habit:", error);
//     res.status(500).json({ message: "Error saving habit" });
//   }
// };

// const editHabit = async (req, res) => {
//   const habitId = req.params.habitId;

//   const { title, frequency, count, selectedDays, selectedDates, times } =
//     req.body;

//   if (!title || !frequency || count == null) {
//     return res.status(400).json({
//       error: "Missing required fields: title, frequency, or count.",
//     });
//   }

//   try {
//     const habitExists = await knex("habits").where({ id: habitId }).first();
//     if (!habitExists) {
//       return res.status(404).json({ error: "Habit not found." });
//     }

//     const alert_times = JSON.stringify(times);
//     const weekly_days = selectedDays.length
//       ? JSON.stringify(selectedDays)
//       : null;
//     const monthly_dates = selectedDates.length
//       ? JSON.stringify(selectedDates)
//       : null;
//     await knex("habits").where({ id: habitId }).update({
//       title,
//       frequency,
//       count,
//       weekly_days,
//       monthly_dates,
//       alert_times,
//       updated_at: knex.fn.now(),
//     });

//     const updatedHabit = await knex("habits").where({ id: habitId }).first();
//     res.status(200).json(updatedHabit);
//   } catch (error) {
//     console.error("Error editing habit:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while editing the habit." });
//   }
// };

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
