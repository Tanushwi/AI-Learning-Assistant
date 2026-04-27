import mongoose from 'mongoose';
import Document from './models/Document.js';

console.log('🔍 Finding Java document ID...');

mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Find any document with Java in the title
    const javaDocs = await Document.find({
      $or: [
        { title: { $regex: 'java', $options: 'i' } },
        { filename: { $regex: 'java', $options: 'i' } },
        { originalname: { $regex: 'java', $options: 'i' } }
      ]
    });
    
    console.log('📄 Found Java documents:', javaDocs.length);
    
    javaDocs.forEach((doc, index) => {
      console.log(`\n📋 Document ${index + 1}:`);
      console.log('  ID:', doc._id);
      console.log('  Title:', doc.title);
      console.log('  Filename:', doc.filename);
      console.log('  Status:', doc.status);
      console.log('  Has extracted text:', !!doc.extractedText);
      console.log('  Text length:', doc.extractedText?.length || 0);
      console.log('  Has chunks:', !!doc.chunks);
      console.log('  Chunks count:', doc.chunks?.length || 0);
    });
    
    // If we found a Java document, update the first one
    if (javaDocs.length > 0) {
      const javaContent = `Java is a high-level, class-based, object-oriented programming language developed by Sun Microsystems (now owned by Oracle). Java was originally developed by James Gosling at Sun Microsystems and released in 1995. Java is designed to have as few implementation dependencies as possible, following the principle "write once, run anywhere" (WORA).

Key Features of Java:
- Object-Oriented Programming (OOP) with classes, inheritance, polymorphism, and encapsulation
- Platform Independence through Java Virtual Machine (JVM)
- Automatic Memory Management with Garbage Collection
- Strong Type Checking and Exception Handling
- Multi-threading Support for Concurrent Programming
- Rich Standard Library (Java API)

Java Architecture:
- Java Development Kit (JDK) - Development tools including javac compiler
- Java Runtime Environment (JRE) - Runtime environment for executing Java programs
- Java Virtual Machine (JVM) - Abstract machine that executes Java bytecode

Common Java Applications:
- Enterprise Applications (Spring, Jakarta EE)
- Android Mobile Development
- Web Applications (Servlets, JSP)
- Big Data Processing (Hadoop, Spark)
- Desktop Applications (Swing, JavaFX)`;

      const javaChunks = [
        { content: javaContent.substring(0, 500), chunkIndex: 0 },
        { content: javaContent.substring(500, 1000), chunkIndex: 1 },
        { content: javaContent.substring(1000), chunkIndex: 2 }
      ];
      
      const docId = javaDocs[0]._id;
      console.log(`\n🔄 Updating document ${docId}...`);
      
      const result = await Document.updateOne(
        { _id: docId },
        {
          extractedText: javaContent,
          chunks: javaChunks,
          status: "ready"
        }
      );
      
      console.log('🎉 SUCCESS! Document updated:');
      console.log('📝 Content length:', javaContent.length);
      console.log('🧩 Chunks created:', javaChunks.length);
      console.log('📊 Matched documents:', result.matchedCount);
      console.log('✅ Modified documents:', result.modifiedCount);
      
      console.log(`\n🚀 USE THIS DOCUMENT ID: ${docId}`);
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
