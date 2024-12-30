import express from "express";
import authenticate from "../utils/authenticate.js";
import * as habitController from "../controllers/habit-controller.js";

const router = express.Router();

router.route("/").post(authenticate, habitController.addHabit);

router.route("/today").get(authenticate, habitController.getTodayHabits)

router.route("/:goalId").get(authenticate, habitController.getHabits);

router.route("/habit/:habitId").get(authenticate, habitController.getOneHabit);

router.route("/habit/:habitId").put(authenticate, habitController.editHabit);

router.route("/:habitId").delete(authenticate, habitController.deleteHabit);

export default router;