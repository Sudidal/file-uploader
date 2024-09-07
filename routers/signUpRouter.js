import express from "express";
import signUpController from "../controllers/signUpController.js";

const router = express.Router();

router.get("/", signUpController.signUpGet);
router.post("/", signUpController.signUpPost);

export { router as signUpRouter };
