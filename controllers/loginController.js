import views from "../views/views.js";
import passport from "passport";

class LoginController {
  constructor() {}

  loginGet(req, res, next) {
    res.render(views.layout, { page: views.login, params: {} });
  }
  loginPost = [
    passport.authenticate("local", {
      // failureMessage: true,
      successRedirect: "/",
      failureRedirect: "/login",
    }),
  ];
}

const loginController = new LoginController();
export default loginController;
