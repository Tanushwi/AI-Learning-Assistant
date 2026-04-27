import mongoose from 'mongoose';
import Document from './models/Document.js';
import { processPDF } from './controllers/documentController.js';

// Connect to MongoDB
import('./config/db.js').then(() => {
  const documentId = '69c5249eb5cc5cee314c26cb';
  const filePath = 'uploads\\documents\\1774527646115-761633577-react_detailed_notes.pdf';
  
  console.log('Reprocessing document:', documentId);
  console.log('File path:', filePath);
  
  processPDF(documentId, filePath)
    .then(() => {
      console.log('Document processed successfully');
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Processing failed:', error);
      mongoose.connection.close();
    });
}).catch(error => {
  console.error('DB connection failed:', error);
});
