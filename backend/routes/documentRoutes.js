import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/auth.js";

// 🔥 IMPORTANT FIX: import whole controller
import * as documentController from "../controllers/documentController.js";

const router = express.Router();

// 🔐 All routes protected
router.use(protect);

// 📤 Upload document
router.post(
  "/upload",
  upload.single("file"),
  documentController.uploadDocument
);

// 📄 Get all documents
router.get("/", documentController.getDocuments);

// 📄 Get single document
router.get("/:id", documentController.getDocument);

// 🗑 Delete document
router.delete("/:id", documentController.deleteDocument);

// 🌐 Public route (NO auth required) → file viewing
export const fileRouter = express.Router();

fileRouter.get(
  "/:id/file",
  documentController.serveDocumentFile
);

// 📦 Export main router
export default router;