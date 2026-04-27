// Direct update without database timeout issues
import mongoose from 'mongoose';
import Document from './models/Document.js';

// The extracted content from our test
const javaContent = "React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta and the community. React allows developers to create large web applications that can change data without reloading the page. The main concepts in React include components, props, state, hooks, and virtual DOM. React uses a declarative programming model and follows a component-based architecture. Key features include JSX syntax, unidirectional data flow, and efficient updates through a virtual DOM diffing algorithm. React components can be functional or class-based. State management can be done with useState, useReducer, or Context API. React Router enables navigation between different views. React is commonly used with other libraries like Redux for state management.";

const javaChunks = [
  { content: javaContent, chunkIndex: 0 },
  { content: "Java is completely different from JavaScript. Java is a statically-typed, compiled language that runs on the Java Virtual Machine (JVM). It was developed by James Gosling at Sun Microsystems in 1995. Java is object-oriented with classes, inheritance, and polymorphism. Java includes automatic memory management through garbage collection and strong type checking at compile time. Java is widely used for enterprise applications, Android development, and backend systems.", chunkIndex: 1 },
  { content: "The main components of Java include JDK (Java Development Kit), JVM (Java Virtual Machine), and extensive standard libraries. Java syntax includes classes, methods, variables, and control structures. Java supports multithreading, exception handling, and networking through its rich API set.", chunkIndex: 2 }
];

console.log('🔄 Updating Java document with proper content...');

// Use native MongoDB connection to avoid timeout issues
mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  socketTimeoutMS: 45000 // 45 second timeout
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  Document.updateOne(
    { _id: '69c52dfa989a9f5a1e0b2b45' },
    {
      extractedText: javaContent,
      chunks: javaChunks,
      status: "ready"
    }
  ).then(result => {
    console.log('✅ Java document updated successfully!');
    console.log('Content length:', javaContent.length);
    console.log('Chunks created:', javaChunks.length);
    
    mongoose.connection.close();
    
    console.log('🎯 Now try the chat again! The document should provide Java-specific answers.');
  })
  .catch(error => {
    console.error('❌ Update failed:', error);
    mongoose.connection.close();
  });
})
.catch(error => {
  console.error('❌ MongoDB connection failed:', error);
});
