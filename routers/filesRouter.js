import express from "express";
import filesController from "../controllers/filesController.js";

const router = express.Router();

router.get("/view", filesController.filesViewGet);
router.get("/view/:folderId", filesController.filesViewGet);

export { router as filesRouter };
