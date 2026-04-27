import mongoose from 'mongoose';
import Document from './models/Document.js';
import fs from 'fs';
import path from 'path';

console.log('🗑️ Deleting existing document...');

mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Find and delete the Java document we just updated
    const docId = '69b306cfdcdd84e94f88d676';
    
    console.log('🔍 Finding document to delete:', docId);
    
    const document = await Document.findOne({ _id: docId });
    
    if (document) {
      console.log('📄 Found document:', document.title);
      console.log('📁 Filename:', document.filename);
      
      // Delete the file from uploads folder
      if (document.filename) {
        const filePath = path.join(process.cwd(), 'uploads', 'documents', document.filename);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('🗑️ File deleted:', filePath);
          } else {
            console.log('📁 File not found:', filePath);
          }
        } catch (fileError) {
          console.log('⚠️ Could not delete file:', fileError.message);
        }
      }
      
      // Delete from database
      const result = await Document.deleteOne({ _id: docId });
      
      console.log('🗑️ Database deletion result:');
      console.log('📊 Deleted documents:', result.deletedCount);
      
      if (result.deletedCount > 0) {
        console.log('✅ SUCCESS! Document deleted completely');
        console.log('🚀 You can now upload a fresh Java document!');
      } else {
        console.log('❌ No document was deleted');
      }
      
    } else {
      console.log('❌ Document not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  mongoose.connection.close();
  console.log('\n✅ DONE!');
})
.catch(error => {
  console.error('❌ Connection failed:', error.message);
});
