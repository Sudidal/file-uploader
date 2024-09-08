import views from "../views/views.js";

class IndexController {
  constructor() {}

  indexGet(req, res, next) {
    res.render(views.layout, {
      page: views.index,
      params: {},
    });
  }
}

const indexController = new IndexController();
export default indexController;
