import views from "../views/views.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class FilesController {
  constructor() {}

  async filesViewGet(req, res, next) {
    // Prisma accepts int as id input
    // prisma outputs null if a column is empty
    let folderId = parseInt(req.params.folderId) || null;
    console.log(folderId);

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        folders: {
          where: {
            parentFolderId: folderId,
          },
        },
        files: {
          where: {
            folderId: folderId,
          },
        },
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

function getDirFromPathFragments(pathArr) {
  // I'm an absolute idiot, i was trying for 2 hours to get the path from the
  // list of ids in the url.. why in the fuck do i need to put a list in the url
  // just put the folder id XDDDDDDDD, that's it
}

const filesController = new FilesController();
export default filesController;
