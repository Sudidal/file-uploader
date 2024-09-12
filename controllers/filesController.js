import views from "../views/views.js";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import fileStorage from "../fileStorage.js";

const upload = multer({ storage: multer.memoryStorage() });
const prisma = new PrismaClient();

class FilesController {
  constructor() {}

  async filesGet(req, res, next) {
    // Prisma accepts int as id input
    // prisma outputs null if a column is empty
    let folderId = parseInt(req.params.folderId) || null;

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
    res.render(views.layout, {
      page: views.files,
      params: {
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
      let folderId = parseInt(req.params.folderId) || null;
      const newFile = await prisma.file.create({
        data: {
          name: req.file.originalname,
          uploadDate: new Date().toISOString(),
          fileSize: req.file.size / 1000000 + "MB",
          folderId: folderId,
          userId: req.user.id,
          downloadUrl: "",
        },
      });

      await fileStorage.uploadFile(req.user.id, newFile.id, req.file.buffer);
      const fileDownloadUrl = await fileStorage.getEternaleDownloadUrl(
        req.user.id,
        newFile.id
      );

      await prisma.file.update({
        where: {
          id: newFile.id,
        },
        data: {
          downloadUrl: fileDownloadUrl,
        },
      });
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
    await prisma.file.findFirst({
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
    await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
    await fileStorage.deleteFile(req.user.id, fileId);
    res.redirect("/");
  }
}

const filesController = new FilesController();
export default filesController;
