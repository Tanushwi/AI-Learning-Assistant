import mongoose from 'mongoose';
import Document from './models/Document.js';
import { processPDF } from './controllers/documentController.js';
import fs from 'fs';
import path from 'path';

// Connect to MongoDB
import('./config/db.js').then(() => {
  const documentId = '69c5249eb5cc5cee314c26cb';
  
  console.log('Finding document to reprocess...');
  
  // Find the document first
  Document.findOne({ _id: documentId })
    .then(document => {
      if (!document) {
        console.log('Document not found');
        mongoose.connection.close();
        return;
      }
      
      console.log('Document found:', document.title);
      console.log('Current status:', document.status);
      console.log('File path from document record:', document.filePath);
      
      // Extract file path from the document record or construct it
      let filePath = null;
      if (document.filePath) {
        // Try to extract path from URL
        const urlPath = document.filePath.replace('http://localhost:8000/', '');
        filePath = path.join(process.cwd(), urlPath);
        console.log('Constructed file path from URL:', filePath);
      }
      
      if (!filePath || !fs.existsSync(filePath)) {
        console.log('File not found at path:', filePath);
        
        // Try alternative paths
        const possiblePaths = [
          path.join(process.cwd(), 'uploads', 'documents', document.filename),
          path.join(process.cwd(), 'uploads', 'documents', document.originalname)
        ];
        
        for (const testPath of possiblePaths) {
          console.log('Testing path:', testPath);
          if (fs.existsSync(testPath)) {
            filePath = testPath;
            console.log('Found file at:', filePath);
            break;
          }
        }
      }
      
      if (!filePath) {
        console.log('Could not find file for document');
        mongoose.connection.close();
        return;
      }
      
      console.log('Starting PDF processing for:', filePath);
      
      // Process the PDF
      processPDF(documentId, filePath)
        .then(() => {
          console.log('✅ Document processed successfully!');
          mongoose.connection.close();
        })
        .catch(error => {
          console.error('❌ Processing failed:', error);
          mongoose.connection.close();
        });
    })
    .catch(error => {
      console.error('DB error:', error);
      mongoose.connection.close();
    });
}).catch(error => {
  console.error('DB connection failed:', error);
});
