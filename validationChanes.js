import { body } from "express-validator";
import validators from "./validators.js";

class ValidationChanes {
  constructor() {}

  userSignUp = () => [
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
}

const validationChanes = new ValidationChanes();
export default validationChanes;
