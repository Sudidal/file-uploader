import express from "express";
import filesController from "../controllers/filesController.js";

const router = express.Router();

//---- Create
router.post("/new_folder", filesController.newFolderPost);
router.post("/new_folder/:folderId", filesController.newFolderPost);

router.post("/new_file", filesController.newFilePost);
router.post("/new_file/:folderId", filesController.newFilePost);

//---- Read
router.get("/", filesController.filesGet);
router.get("/:folderId", filesController.filesGet);

//---- Update
router.post("/update_folder/:folderId", filesController.updateFolderPost);

router.post("/update_file/:fileId", filesController.updateFilePost);

//---- Delete
router.get("/delete_folder/:folderId", filesController.deleteFolderGet);

router.get("/delete_file/:fileId", filesController.deleteFileGet);

router.get("/download/:fileId", filesController.downloadFileGet);

export { router as filesRouter };
