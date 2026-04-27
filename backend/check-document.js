import mongoose from 'mongoose';
import Document from './models/Document.js';

import('./config/db.js').then(() => {
  const documentId = '69c52dfa989a9f5a1e0b2b45'; // Java document ID from logs
  
  console.log('Checking document status and content...');
  
  Document.findOne({ _id: documentId })
    .then(document => {
      if (!document) {
        console.log('❌ Document not found');
        mongoose.connection.close();
        return;
      }
      
      console.log('📄 Document found:', {
        title: document.title,
        status: document.status,
        hasExtractedText: !!document.extractedText,
        extractedTextLength: document.extractedText?.length || 0,
        hasChunks: document.chunks && document.chunks.length > 0,
        chunksCount: document.chunks?.length || 0
      });
      
      if (document.status === 'ready' && document.extractedText) {
        console.log('✅ Document is ready with content!');
        console.log('First 200 chars of content:', document.extractedText.substring(0, 200));
      } else {
        console.log('❌ Document needs processing or has no content');
      }
      
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('❌ Database error:', error);
      mongoose.connection.close();
    });
}).catch(error => {
  console.error('❌ DB connection failed:', error);
});
