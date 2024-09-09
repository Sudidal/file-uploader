class LogoutController {
  constructor() {}

  logoutGet(req, res, next) {
    if (!req.user) {
      return res.redirect("/login");
    }
    req.logout((err) => {
      if (err) {
        if (!req.session.messages) req.session.messages = {};
        req.session.messages.push(err);
      }
      res.redirect("/");
    });
  }
}

const logoutController = new LogoutController();
export default logoutController;
