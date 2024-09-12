import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";
import validationChanes from "../validators/validationChanes.js";
import views from "../views/views.js";
import fileStorage from "../storage/fileStorage.js";

const prisma = new PrismaClient();

class SignUpController {
  constructor() {}
  async signUpGet(req, res, next) {
    res.render(views.layout, {
      page: views.signup,
      params: {},
    });
  }
  signUpPost = [
    validationChanes.userSignUp(),
    async (req, res, next) => {
      const validationsErrs = validationResult(req);
      if (!validationsErrs.isEmpty()) {
        console.log(validationsErrs);
        req.errors = validationsErrs.array;
        return res.status(400).redirect("/signup");
      }
      const validatedData = matchedData(req);
      try {
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        try {
          const createdUser = await prisma.user.create({
            data: {
              username: validatedData.username,
              password: hashedPassword,
            },
          });

          fileStorage.createBucket(createdUser.id, true, 1000000 * 20); //20MB
        } catch (err) {
          next(err);
        }
      } catch (err) {
        next(err);
      }
      res.redirect("/login");
    },
  ];
}

const signUpController = new SignUpController();
export default signUpController;
