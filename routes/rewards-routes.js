import express from "express";
import authenticate from "../utils/authenticate.js";
import * as rewardController from "../controllers/reward-controller.js";

const router = express.Router();

router.route("/").post(authenticate, rewardController.setReward);

router.route("/:goalId").get(authenticate, rewardController.getOneReward);

router.route("/").get(authenticate, rewardController.getAllRewards);

router.route("/:rewardId").put(authenticate, rewardController.editReward);

export default router;