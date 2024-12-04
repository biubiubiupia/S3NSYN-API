import express from "express";
import authenticate from "../middleware/authenticate.js";
import * as rewardController from "../controllers/reward-controller.js";

const router = express.Router();

router.route("/").post(authenticate, rewardController.setReward);

router.route("/:goalId").get(authenticate, rewardController.getOneReward);

router.route("/:rewardId").delete(authenticate, rewardController.deleteReward);

export default router;