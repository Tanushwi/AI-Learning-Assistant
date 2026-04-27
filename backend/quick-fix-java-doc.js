import mongoose from 'mongoose';
import { extractTextFromPDF } from './utils/pdfParser.js';
import { chunkText } from './utils/textChunker.js';
import Document from './models/Document.js';
import path from 'path';

// Quick fix to reprocess Java document
import('./config/db.js').then(async () => {
  try {
    const documentId = '69c52dfa989a9f5a1e0b2b45'; // Java document ID from logs
    
    console.log('🔄 Reprocessing Java document...');
    
    // Find the document
    const document = await Document.findOne({ _id: documentId });
    if (!document) {
      console.log('❌ Document not found');
      process.exit(1);
    }
    
    console.log('📄 Document found:', document.title);
    
    // Find the actual PDF file
    const fileName = document.filename || '1774630803920-722690833-Java_Notes_Final.pdf';
    const filePath = path.join(process.cwd(), 'uploads', 'documents', fileName);
    
    console.log('📁 Processing file:', filePath);
    
    // Extract text using the updated PDF parser
    const { text } = await extractTextFromPDF(filePath);
    console.log('✅ Text extracted:', text.length, 'characters');
    
    // Create chunks
    const chunks = chunkText(text, 500, 50);
    console.log('✅ Chunks created:', chunks.length);
    
    // Update document
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready"
    });
    
    console.log('🎉 Java document updated successfully!');
    console.log('📊 New content length:', text.length);
    console.log('🧩 Chunks created:', chunks.length);
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ DB connection failed:', error);
  process.exit(1);
});
