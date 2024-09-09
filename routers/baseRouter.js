import express from "express";
import { indexRouter } from "./indexRouter.js";
import { signUpRouter } from "./signUpRouter.js";
import { loginRouter } from "./loginRouter.js";
import { logoutRouter } from "./logoutRouter.js";

const router = express.Router();

router.use("/", indexRouter);
router.use("/signup", signUpRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);

export { router as baseRouter };
