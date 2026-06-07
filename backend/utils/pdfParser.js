import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import mammoth from "mammoth";
import officeParser from "officeparser";

const require = createRequire(import.meta.url);

// ============================
// EXTRACT TEXT FROM DOCUMENTS
// ============================

export const extractTextFromPDF = async (filePath) => {

  try {

    const ext = path.extname(filePath).toLowerCase();

    // ============================================================
    // PDF FILES
    // ============================================================

    if (ext === ".pdf") {

      try {

        // ✅ Better PDF parser
        const pdfjsLib = await import(
          "pdfjs-dist/legacy/build/pdf.mjs"
        );

        // ✅ OCR fallback
        const Tesseract = require("tesseract.js");

        // Read PDF
        const dataBuffer = await fs.readFile(filePath);

        const uint8Array = new Uint8Array(dataBuffer);

        // Load PDF
        const pdf = await pdfjsLib.getDocument({
          data: uint8Array,
        }).promise;

        let extractedText = "";

        // ============================================================
        // READ ALL PAGES
        // ============================================================

        for (let i = 1; i <= pdf.numPages; i++) {

          const page = await pdf.getPage(i);

          const textContent = await page.getTextContent();

          const pageText = textContent.items
            .map(item => item.str)
            .join(" ");

          extractedText += pageText + "\n";
        }

        extractedText = extractedText.trim();

        console.log("✅ PDF Parsed Successfully");

        console.log({
          textLength: extractedText.length,
          pages: pdf.numPages,
        });

        // ============================================================
        // OCR FALLBACK
        // ============================================================

        if (extractedText.length < 20) {

          console.log("⚠️ Running OCR fallback...");

          const result = await Tesseract.recognize(
            filePath,
            "eng"
          );

          extractedText =
            result.data.text?.trim() || "";

          console.log("🧠 OCR Completed");

          console.log({
            ocrTextLength: extractedText.length,
          });
        }

        // ============================================================
        // VALIDATION
        // ============================================================

        if (!extractedText) {

          throw new Error(
            "No readable text found in PDF"
          );
        }

        return {
          text: extractedText,
          numPages: pdf.numPages || 1,
        };

      } catch (pdfError) {

        console.error("❌ PDF Parsing Failed:");

        console.error(pdfError);

        throw new Error("Failed to parse PDF file");
      }
    }

    // ============================================================
    // DOCX / DOC FILES
    // ============================================================

    if (ext === ".docx" || ext === ".doc") {

      try {

        // ================= DOCX =================

        if (ext === ".docx") {

          const result =
            await mammoth.extractRawText({
              path: filePath,
            });

          const extractedText =
            result.value?.trim() || "";

          if (!extractedText) {

            throw new Error(
              "No readable DOCX text found"
            );
          }

          console.log(
            "✅ DOCX Parsed Successfully"
          );

          return {
            text: extractedText,
            numPages: 1,
          };
        }

        // ================= DOC =================

        const text = await new Promise(
          (resolve, reject) => {

            officeParser.parseOffice(
              filePath,
              function (data, err) {

                if (err) reject(err);
                else resolve(data);
              }
            );
          }
        );

        if (!text || !String(text).trim()) {

          throw new Error(
            "No readable DOC text found"
          );
        }

        console.log("✅ DOC Parsed Successfully");

        return {
          text: String(text),
          numPages: 1,
        };

      } catch (docError) {

        console.error(
          "❌ DOC/DOCX Parsing Failed:"
        );

        console.error(docError);

        throw new Error(
          "Failed to parse Word document"
        );
      }
    }

    // ============================================================
    // PPT / PPTX FILES
    // ============================================================

    if (ext === ".pptx" || ext === ".ppt") {

      try {

        const data = await new Promise(
          (resolve, reject) => {

            officeParser.parseOffice(
              filePath,
              function (data, err) {

                if (err) reject(err);
                else resolve(data);
              }
            );
          }
        );

        let text = "";

        if (data && typeof data === "object") {

          if (typeof data.toText === "function") {

            text = data.toText();

          } else {

            text = JSON.stringify(data);
          }

        } else {

          text = String(data);
        }

        text = text.trim();

        if (!text) {

          throw new Error(
            "No readable PPT text found"
          );
        }

        console.log("✅ PPT Parsed Successfully");

        return {
          text,
          numPages: 1,
        };

      } catch (pptError) {

        console.error("❌ PPT Parsing Failed:");

        console.error(pptError);

        throw new Error(
          "Failed to parse PowerPoint file"
        );
      }
    }

    // ============================================================
    // TXT FILES
    // ============================================================

    if (ext === ".txt") {

      try {

        const text = await fs.readFile(
          filePath,
          "utf-8"
        );

        if (!text.trim()) {

          throw new Error("Empty TXT file");
        }

        console.log("✅ TXT Parsed Successfully");

        return {
          text: text.trim(),
          numPages: 1,
        };

      } catch (txtError) {

        console.error("❌ TXT Parsing Failed:");

        console.error(txtError);

        throw new Error(
          "Failed to parse TXT file"
        );
      }
    }

    // ============================================================
    // UNSUPPORTED FILE
    // ============================================================

    throw new Error("Unsupported file format");

  } catch (error) {

    console.error("❌ FILE PARSING ERROR:");

    console.error(error);

    throw new Error(
      "Failed to extract text from document"
    );
  }
};