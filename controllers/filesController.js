import views from "../views/views.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class FilesController {
  constructor() {}

  async filesGet(req, res, next) {
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

const filesController = new FilesController();
export default filesController;
