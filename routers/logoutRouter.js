import express from "express";
import logoutController from "../controllers/logoutController.js";

const router = express.Router();

router.get("/", logoutController.logoutGet);

export { router as logoutRouter };
