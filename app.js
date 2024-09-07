import { config } from "dotenv";
import process from "node:process";
import express from "express";
import views from "./views/views.js";
import { baseRouter } from "./routers/baseRouter.js";

config();

const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.locals.views = views;

app.use("/", [
  (req, res, next) => {
    res.locals.views = app.locals.views;
    next();
  },
  baseRouter,
]);

app.listen(PORT, () => {
  console.log(
    "Server running at port: " +
      PORT +
      "\n\x1b[32m" +
      "http://localhost:3000" +
      "\x1b[0m"
  );
});
