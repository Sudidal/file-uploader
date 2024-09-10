import express from "express";
import filesController from "../controllers/filesController.js";

const router = express.Router();

router.get("/", filesController.filesGet);

export { router as filesRouter };
