import { extractTextFromPDF } from './utils/pdfParser.js';
import path from 'path';
import fs from 'fs';

// Test the PDF extraction on the uploaded file
const testPdfPath = path.join(process.cwd(), 'uploads', 'documents', '1774527646115-761633577-react_detailed_notes.pdf');

console.log('Testing PDF extraction for:', testPdfPath);
console.log('File exists:', fs.existsSync(testPdfPath));

extractTextFromPDF(testPdfPath)
  .then(result => {
    console.log('Extraction successful!');
    console.log('Text length:', result.text.length);
    console.log('First 200 chars:', result.text.substring(0, 200));
    console.log('Number of pages:', result.numPages);
  })
  .catch(error => {
    console.error('Extraction failed:', error.message);
    console.error('Full error:', error);
  });
