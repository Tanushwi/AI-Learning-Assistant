import fs from "fs";
import path from "path";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import Document from "../models/Document.js";

const processPDF = async (documentId, filePath) => {
  try {
    console.log("📂 Processing file:", filePath);

    // ✅ STEP 1: Check file exists
    if (!fs.existsSync(filePath)) {
      console.log("❌ File not found on disk");

      await Document.findByIdAndUpdate(documentId, {
        status: "failed",
        extractedText: "",
        chunks: [],
      });

      return;
    }

    // ✅ STEP 2: Extract text
    const result = await extractTextFromPDF(filePath);

    console.log("📄 Raw extraction result:", result);

    const text = result?.text || "";

    // ❌ No text case
    if (!text || text.trim().length === 0) {
      console.log("❌ No text extracted from PDF");

      await Document.findByIdAndUpdate(documentId, {
        status: "failed",
        extractedText: "",
        chunks: [],
      });

      return;
    }

    console.log("✅ Text extracted length:", text.length);

    // ✅ STEP 3: Chunking
    const chunks = chunkText(text, 500, 50);

    console.log("🧩 Chunks created:", chunks.length);

    // ❌ No chunks safety
    if (!chunks || chunks.length === 0) {
      console.log("❌ Chunking failed");

      await Document.findByIdAndUpdate(documentId, {
        status: "failed",
        extractedText: text,
        chunks: [],
      });

      return;
    }

    // ✅ STEP 4: Save to DB
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });

    console.log("✅ Document successfully processed");

  } catch (error) {
    console.error("❌ PDF PROCESS ERROR:", error);

    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
      extractedText: "",
      chunks: [],
    });
  }
};

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file"
      });
    }

    const { title } = req.body;

    if (!title) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Please provide a document title"
      });
    }

    const document = await Document.create({
      userId: req.user?._id || "demo_user",
      title: title,
      filename: req.file.filename,
      originalname: req.file.originalname,
      filePath: `/uploads/documents/${req.file.filename}`,
      fileSize: req.file.size,
      status: "processing"
    });

    // Process in background
    processPDF(document._id, req.file.path).catch((err) => {
      console.error("PDF processing error:", err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: "Document uploaded successfully. Processing in progress..."
    });

  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({
      userId: req.user?._id || "demo_user"
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user?._id || "demo_user"
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Serve file for viewing (public route)
// @route   GET /api/documents/:id/file
// @access  Public
const serveDocumentFile = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404
      });
    }

    const filePath = path.join(process.cwd(), 'uploads', 'documents', document.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "File not found on disk",
        statusCode: 404
      });
    }

    res.sendFile(filePath);

  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user?._id || "demo_user"
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404
      });
    }

    const filePath = path.join(process.cwd(), 'uploads', 'documents', document.filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.deleteOne({ _id: document._id });

    res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

export { 
  processPDF,
  uploadDocument,
  getDocuments,
  getDocument,
  serveDocumentFile,
  deleteDocument
};