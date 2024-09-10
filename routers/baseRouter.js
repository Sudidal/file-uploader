import express from "express";
import { signUpRouter } from "./signUpRouter.js";
import { loginRouter } from "./loginRouter.js";
import { logoutRouter } from "./logoutRouter.js";
import { filesRouter } from "./filesRouter.js";

const router = express.Router();

router.use("/signup", [redirectAuthenticated, signUpRouter]);
router.use("/login", [redirectAuthenticated, loginRouter]);
router.use("/logout", [redirectUnAuthenticated, logoutRouter]);
router.use("/files", [redirectUnAuthenticated, filesRouter]);
router.use("/", (req, res, next) => {
  res.redirect("/files");
});

function redirectUnAuthenticated(req, res, next) {
  if (!req.user) {
    console.log("nope");
    return res.redirect("/login");
  }
  next();
}
function redirectAuthenticated(req, res, next) {
  if (req.user) {
    return res.redirect("/");
  }
  next();
}

export { router as baseRouter };
