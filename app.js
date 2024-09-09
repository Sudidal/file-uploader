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

const file = new File(["haha just some data"], "data.txt", {
  type: "txt/plain",
});
const supaBase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
// const { data, error } = await supaBase.storage.createBucket("oxide2", {
//   public: false,
//   fileSizeLimit: 30000, // 1000 * 30 = 30 MegaBytes
// });
// const { data, error } = await supaBase.storage
//   .from("oxide")
//   .upload("/useless/data.txt", file);

// console.log(data);
// console.log(error);

let url = "";
function getUrl() {
  const { data } = supaBase.storage
    .from("oxide")
    .getPublicUrl("useless/data.txt");
  url = data.publicUrl.replace("public", "authenticated");
  console.log(data.publicUrl);
}
getUrl();
const { data, error } = await supaBase.storage
  .from("oxide")
  .download("useless/data2.txt");
console.log(data);
console.log(error);

const PORT = process.env.PORT;

const app = express();

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

app.locals.views = views;

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
