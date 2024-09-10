import { config } from "dotenv";
import configurePassport from "./passportConfig.js";
import passport from "passport";
import process from "node:process";
import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import views from "./views/views.js";
import { baseRouter } from "./routers/baseRouter.js";
import { createClient } from "@supabase/supabase-js";

config();
configurePassport();

const PORT = process.env.PORT;

const app = express();

app.locals.views = views;

app.set("view engine", "ejs");

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2, //2 days
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", [
  (req, res, next) => {
    res.locals.user = req.user;
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
