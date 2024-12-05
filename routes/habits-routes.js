import express from "express";
import authenticate from "../middleware/authenticate.js";
import * as habitController from "../controllers/habit-controller.js";

const router = express.Router();

router.route("/").post(authenticate, habitController.addHabit);

router.route("/:goalId").get(authenticate, habitController.getHabits);

router.route("/habit/:habitId").get(authenticate, habitController.getOneHabit);

router.route("/:habitId").put(authenticate, habitController.editHabit);


export default router;