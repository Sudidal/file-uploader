import express from "express";
import filesController from "../controllers/filesController.js";

const router = express.Router();

router.get("/", filesController.filesGet);
router.get("/:folderId", filesController.filesGet);

router.post("/new_folder", filesController.foldersPost);
router.post("/new_folder/:folderId", filesController.foldersPost);

router.post("/new_file", filesController.filesPost);
router.post("/new_file/:folderId", filesController.filesPost);

export { router as filesRouter };
