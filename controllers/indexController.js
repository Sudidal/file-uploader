class IndexController {
  constructor() {}

  indexGet(req, res, next) {
    if (req.user) {
      return res.redirect("/files");
    } else {
      return res.redirect("/login");
    }
  }
}

const indexController = new IndexController();
export default indexController;
