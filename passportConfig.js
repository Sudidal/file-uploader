import passport from "passport";
import localStrategy from "passport-local";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.deserializeUser((user, done) => {
  done(null, user.id);
});

passport.serializeUser(async (id, done) => {
  try {
    const rows = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const rows = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      const user = rows[0];
      if (!user) {
        return done(null, false, { message: "Username not found" });
      }
      if (user.password !== password) {
        return done(null, false, { messages: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
