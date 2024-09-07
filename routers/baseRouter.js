import express from "express";
import { signUpRouter } from "./signUpRouter.js";

const router = express.Router();

router.use("/signup", signUpRouter);

export { router as baseRouter };
