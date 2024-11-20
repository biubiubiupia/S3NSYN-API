import express from "express";
import * as authController from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/register").post(authController.createAccount);

router.route("/login").post(authController.login);

export default router;
