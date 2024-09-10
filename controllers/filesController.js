import views from "../views/views.js";
import multer from "multer";
import { PrismaClient } from "@prisma/client";

const upload = multer({ dest: "uploads/" });

const prisma = new PrismaClient();

class FilesController {
  constructor() {}

  async filesGet(req, res, next) {
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
      page: views.files,
      params: {
        username: user.username,
        folderId: folderId,
        folders: user.folders,
        files: user.files,
      },
    });
  }

  async foldersPost(req, res, next) {
    let folderId = parseInt(req.params.folderId) || null;
    await prisma.folder.create({
      data: {
        name: req.body.folderName,
        userId: req.user.id,
        parentFolderId: folderId,
      },
    });
    res.redirect("/");
  }
  filesPost = [
    upload.single("file"),
    async (req, res, next) => {
      console.log("hiiiiiiiiii");
      console.log(req.file);
      let folderId = parseInt(req.params.folderId) || null;
      await prisma.file.create({
        data: {
          name: req.file.originalname,
          uploadDate: new Date().toISOString(),
          fileSize: req.file.size / 1000000 + "MB",
          folderId: folderId,
          userId: req.user.id,
        },
      });
      res.redirect("/");
    },
  ];
}

const filesController = new FilesController();
export default filesController;
