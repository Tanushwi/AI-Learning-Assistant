import mongoose from 'mongoose';
import Document from './models/Document.js';
import { chunkText } from './utils/textChunker.js';

console.log('🔧 FIXING CHUNKS FOR JAVA DOCUMENT...');

mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  try {
    // Find the Java document
    const javaDoc = await Document.findOne({ 
      title: 'Java_Notes_Final',
      status: 'ready' 
    });
    
    if (!javaDoc) {
      console.log('❌ Java document not found');
      return;
    }
    
    console.log('📄 Found document:', {
      id: javaDoc._id,
      title: javaDoc.title,
      status: javaDoc.status,
      hasExtractedText: !!javaDoc.extractedText,
      textLength: javaDoc.extractedText?.length || 0,
      hasChunks: !!javaDoc.chunks,
      chunksCount: javaDoc.chunks?.length || 0
    });
    
    // If no chunks, create them from extracted text
    if (!javaDoc.chunks || javaDoc.chunks.length === 0) {
      if (!javaDoc.extractedText) {
        console.log('❌ No extracted text to create chunks from');
        return;
      }
      
      console.log('🔄 Creating chunks from extracted text...');
      const chunks = chunkText(javaDoc.extractedText, 500, 50);
      console.log('✅ Created chunks:', chunks.length);
      
      // Update document with chunks
      await Document.findByIdAndUpdate(javaDoc._id, {
        chunks: chunks,
        status: "ready"
      });
      
      console.log('✅ Document updated with chunks!');
    } else {
      console.log('✅ Chunks already exist:', javaDoc.chunks.length);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  mongoose.connection.close();
  console.log('🚀 CHUNKS FIXED! Ready for chat!');
})
.catch(error => {
  console.error('❌ Connection failed:', error.message);
});
