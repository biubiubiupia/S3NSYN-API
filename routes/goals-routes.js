import express from "express";
import authenticate from "../middleware/authenticate.js";
import * as goalController from "../controllers/goal-controller.js";

const router = express.Router();

router.route("/").get(authenticate, goalController.getGoals);

router.route("/:goalId").get(authenticate, goalController.getOneGoal);

router.route("/").post(authenticate, goalController.addGoal);

router.route("/:goalId").put(authenticate, goalController.editGoal);

router.route("/:goalId").delete(authenticate, goalController.deleteGoal);

export default router;
