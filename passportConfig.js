import passport from "passport";
import localStrategy from "passport-local";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function configurePassport() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
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
      console.log(username);
      try {
        const user = await prisma.user.findFirst({
          where: {
            username: username,
          },
        });
        if (!user) {
          console.log("username");
          return done(null, false, { messages: "Username not found" });
        }
        try {
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            console.log("password");
            return done(null, false, { messages: "Incorrect password" });
          }
          return done(null, user);
        } catch (err) {
          done(err);
        }
      } catch (err) {
        done(err);
      }
    })
  );
}
