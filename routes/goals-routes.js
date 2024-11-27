import express from "express";
import authenticate from "../middleware/authenticate.js";
import * as goalController from "../controllers/goal-controller.js";

const router = express.Router();

router.route("/").get(authenticate, goalController.getGoals);

router.route("/").post(authenticate, goalController.addGoal);

export default router;
