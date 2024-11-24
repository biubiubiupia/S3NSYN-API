import express from "express";
import * as goalController from "../controllers/goal-controller.js";

const router = express.Router();

router.route("/goals").get(goalController.getGoal);

router.route("/login").post(authController.login);

export default router;
