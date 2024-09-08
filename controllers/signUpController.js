import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";
import validators from "../validators.js";
import views from "../views/views.js";

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
    validateSignUp,
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
          await prisma.user.create({
            data: {
              username: validatedData.username,
              password: hashedPassword,
            },
          });
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
      res.redirect("/login");
    },
  ];
}

const validateSignUp = [
  body("username")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters")
    .bail()
    .custom(validators.isUserNotExist)
    .withMessage("Username already exist"),
  body("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Password can not be empty"),
  body("confirm_password")
    .isString()
    .trim()
    .notEmpty()
    .custom((value, { req }) => {
      return req.body.password === req.body.confirm_password;
    })
    .withMessage("Passwords do not match"),
];

const signUpController = new SignUpController();
export default signUpController;
