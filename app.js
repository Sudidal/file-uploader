import { config } from "dotenv";
import configurePassport from "./passportConfig.js";
import process from "node:process";
import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import views from "./views/views.js";
import { baseRouter } from "./routers/baseRouter.js";

config();
configurePassport();

const PORT = process.env.PORT;

const app = express();

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

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.locals.views = views;

app.use("/", baseRouter);

app.listen(PORT, () => {
  console.log(
    "Server running at port: " +
      PORT +
      "\n\x1b[32m" +
      "http://localhost:3000" +
      "\x1b[0m"
  );
});
