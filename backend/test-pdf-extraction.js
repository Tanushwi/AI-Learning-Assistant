import { extractTextFromPDF } from './utils/pdfParser.js';
import path from 'path';
import fs from 'fs';

// Test PDF extraction on the Java document
const testExtraction = async () => {
  try {
    const pdfPath = path.join(process.cwd(), 'uploads', 'documents', '1774530042921-848210867-Java_Notes_Final.pdf');
    
    console.log('🔍 Testing PDF extraction on:', pdfPath);
    console.log('File exists:', fs.existsSync(pdfPath));
    
    const result = await extractTextFromPDF(pdfPath);
    
    console.log('✅ Extraction successful!');
    console.log('Text length:', result.text.length);
    console.log('Number of pages:', result.numPages);
    console.log('First 200 chars:', result.text.substring(0, 200));
    
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    console.error('Full error:', error);
  }
};

testExtraction();
