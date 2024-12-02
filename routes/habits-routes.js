import express from "express";
import authenticate from "../middleware/authenticate.js";
import * as habitController from "../controllers/habit-controller.js";

const router = express.Router();

router.route("/").post(authenticate, habitController.addHabit);

export default router;