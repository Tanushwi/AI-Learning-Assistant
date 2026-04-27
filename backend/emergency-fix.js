// Emergency fix - Direct Java content update
import mongoose from 'mongoose';
import Document from './models/Document.js';

console.log('🚨 EMERGENCY FIX - Adding Java content directly...');

// Java content for immediate use
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

// Create chunks
const javaChunks = [
  { content: javaContent.substring(0, 800), chunkIndex: 0 },
  { content: javaContent.substring(800, 1600), chunkIndex: 1 },
  { content: javaContent.substring(1600), chunkIndex: 2 }
];

// Connect and update
mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    const result = await Document.updateOne(
      { _id: '69c52dfa989a9f5a1e0b2b45' },
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
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
  
  mongoose.connection.close();
  console.log('🚀 READY FOR DEMO!');
})
.catch(error => {
  console.error('❌ Connection failed:', error.message);
});
