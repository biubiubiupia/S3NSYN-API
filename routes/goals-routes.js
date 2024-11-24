import express from "express";
import * as goalController from "../controllers/goal-controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.route("/goals").get(authenticate, goalController.getGoals);

export default router;
