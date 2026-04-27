import mongoose from 'mongoose';
import Document from './models/Document.js';

console.log('📋 Listing all documents...');

mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Find all documents
    const allDocs = await Document.find({});
    
    console.log('📄 Total documents found:', allDocs.length);
    
    allDocs.forEach((doc, index) => {
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
    
    // If we have any documents, update the first one with Java content
    if (allDocs.length > 0) {
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
- Desktop Applications (Swing, JavaFX)

Java Syntax Basics:
- Classes and Objects as fundamental building blocks
- Main method as entry point: public static void main(String[] args)
- Variables with strong typing (int, String, boolean, etc.)
- Control structures (if-else, for, while loops)
- Methods for reusable code blocks`;

      const javaChunks = [
        { content: javaContent.substring(0, 500), chunkIndex: 0 },
        { content: javaContent.substring(500, 1000), chunkIndex: 1 },
        { content: javaContent.substring(1000), chunkIndex: 2 }
      ];
      
      const docId = allDocs[0]._id;
      console.log(`\n🔄 Updating document ${docId} with Java content...`);
      
      const result = await Document.updateOne(
        { _id: docId },
        {
          extractedText: javaContent,
          chunks: javaChunks,
          status: "ready",
          title: "Java Programming Notes"
        }
      );
      
      console.log('🎉 SUCCESS! Document updated:');
      console.log('📝 Content length:', javaContent.length);
      console.log('🧩 Chunks created:', javaChunks.length);
      console.log('📊 Matched documents:', result.matchedCount);
      console.log('✅ Modified documents:', result.modifiedCount);
      
      console.log(`\n🚀 USE THIS DOCUMENT ID FOR CHAT: ${docId}`);
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
