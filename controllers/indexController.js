import views from "../views/views.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class IndexController {
  constructor() {}

  async indexGet(req, res, next) {
    if (!req.user) {
      return res.redirect("/login");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        folders: true,
        files: true,
      },
    });
    if (!user) {
      next(new Error("Cannot access user data"));
    }
    console.log(user.folders);
    res.render(views.layout, {
      page: views.index,
      params: { folders: user.folders, files: user.files },
    });
  }
}

const indexController = new IndexController();
export default indexController;
