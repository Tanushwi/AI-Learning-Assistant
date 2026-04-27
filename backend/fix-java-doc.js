import mongoose from 'mongoose';
import Document from './models/Document.js';

// Quick fix to update Java document with mock content
import('./config/db.js').then(() => {
  const documentId = '69c52dfa989a9f5a1e0b2b45'; // Java document ID
  
  // Mock Java content for testing
  const mockJavaText = "Java is a high-level, class-based, object-oriented programming language developed by Sun Microsystems (now owned by Oracle). Java is designed to have as few implementation dependencies as possible, following the principle 'write once, run anywhere' (WORA). Java applications are typically compiled to bytecode that can run on any Java Virtual Machine (JVM) regardless of computer architecture. Key features of Java include automatic memory management, strong type checking, exception handling, and a vast standard library. Java is widely used for enterprise applications, Android development, web applications, and big data systems. The Java Development Kit (JDK) provides tools like javac (compiler), java (runtime), and other utilities for Java development.";
  
  const mockJavaChunks = [
    { content: mockJavaText, chunkIndex: 0 },
    { content: "Java syntax includes classes, objects, methods, variables, and control structures. Java supports inheritance, polymorphism, encapsulation, and abstraction as core OOP principles. The main method serves as entry point for Java applications. Java uses static typing and automatic garbage collection for memory management.", chunkIndex: 1 },
    { content: "Java Virtual Machine (JVM) allows Java programs to be platform-independent. Java programs are compiled to bytecode which runs on JVM. Java includes rich APIs for networking, database connectivity, GUI development, and concurrent programming through threads and executors.", chunkIndex: 2 }
  ];
  
  console.log('Updating Java document with mock content...');
  
  // Update document directly
  Document.updateOne(
    { _id: documentId },
    {
      extractedText: mockJavaText,
      chunks: mockJavaChunks,
      status: "ready"
    }
  ).then(result => {
    console.log('✅ Java document updated successfully!');
    console.log('New status: ready');
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ Update failed:', error);
    mongoose.connection.close();
  });
}).catch(error => {
  console.error('❌ DB connection failed:', error);
});
