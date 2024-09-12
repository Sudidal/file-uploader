import views from "../views/views.js";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import process from "node:process";
import { getPathByFolderId } from "../utils/fullFolderPath.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
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

  async newFolderPost(req, res, next) {
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
  newFilePost = [
    upload.single("file"),
    async (req, res, next) => {
      console.log(typeof req.file);
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
      const path = await getPathByFolderId(folderId);
      const { data, error } = supabase.storage
        .from(req.user.username + req.user.id)
        .upload(`${path}/${req.file.originalname}`, req.file);
      if (error) {
        return next(error);
      }
      res.redirect("/");
    },
  ];

  async updateFolderPost(req, res, next) {
    let folderId = parseInt(req.params.folderId) || null;
    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: req.body.newFolderName,
        parentFolderId: parseInt(req.body.newFolderId),
      },
    });
    res.redirect("/");
  }
  async updateFilePost(req, res, next) {
    let fileId = parseInt(req.params.fileId) || null;
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });
    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        name: req.body.newFileName,
        folderId: parseInt(req.body.newFolderId),
      },
    });
    const oldPath = await getPathByFolderId(file.folderId);
    const newPath = await getPathByFolderId(parseInt(req.body.newFolderId));
    console.log("gong to: " + newPath);
    supabase.storage
      .from(req.user.username + req.user.id)
      .move(`${oldPath}/${file.name}`, `${newPath}/${req.body.newFileName}`);
    res.redirect("/");
  }

  async deleteFolderGet(req, res, next) {
    let folderId = parseInt(req.params.folderId) || null;
    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
    res.redirect("/");
  }
  async deleteFileGet(req, res, next) {
    let fileId = parseInt(req.params.fileId) || null;
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
    const path = await getPathByFolderId(file.folderId);
    const { data, error } = supabase.storage
      .from(req.user.username + req.user.id)
      .remove(`${path}/${file.name}`);
    if (error) {
      return next(error);
    }
    res.redirect("/");
  }
}

const filesController = new FilesController();
export default filesController;
