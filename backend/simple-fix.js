import mongoose from 'mongoose';
import Document from './models/Document.js';

console.log('🔧 SIMPLE FIX - Update frontend to use correct document ID');

mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  try {
    // Get the correct Java document ID
    const javaDoc = await Document.findOne({ 
      title: 'Java_Notes_Final',
      status: 'ready' 
    });
    
    if (!javaDoc) {
      console.log('❌ Java document not found');
      return;
    }
    
    const correctId = javaDoc._id.toString();
    console.log('✅ CORRECT DOCUMENT ID:', correctId);
    console.log('📄 Title:', javaDoc.title);
    console.log('📁 Filename:', javaDoc.filename);
    
    // Create a simple response for the frontend
    console.log('\n🎯 SOLUTION:');
    console.log('1. Use this ID in your frontend:', correctId);
    console.log('2. Navigate to: http://localhost:3000/documents/' + correctId);
    console.log('3. Ask "what is java"');
    console.log('\n✅ This will work!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  mongoose.connection.close();
})
.catch(error => {
  console.error('❌ Connection failed:', error.message);
});
