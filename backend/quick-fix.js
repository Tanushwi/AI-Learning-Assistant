import mongoose from 'mongoose';
import Document from './models/Document.js';

// Quick fix to update document with mock React content
import('./config/db.js').then(() => {
  const documentId = '69c5249eb5cc5cee314c26cb';
  
  // Mock React content for testing
  const mockReactText = "React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta and the community. React allows developers to create large web applications that can change data without reloading the page. The main concepts in React include components, props, state, hooks, and the virtual DOM. React uses a declarative programming model and follows a component-based architecture. Key features include JSX syntax, unidirectional data flow, and efficient updates through a virtual DOM diffing algorithm. React components can be functional or class-based. State management can be done with useState, useReducer, or Context API. React Router enables navigation between different views. React is commonly used with other libraries like Redux for state management.";
  
  const mockChunks = [
    { content: mockReactText, chunkIndex: 0 },
    { content: "React components are reusable building blocks that accept inputs and return React elements describing what should appear on the screen.", chunkIndex: 1 },
    { content: "State management in React is crucial for handling data that changes over time. The useState hook allows functional components to have local state. useEffect hook handles side effects. Context API provides a way to pass data through the component tree without prop drilling.", chunkIndex: 2 }
  ];
  
  console.log('Updating document with mock React content...');
  
  // Update document directly
  Document.updateOne(
    { _id: documentId },
    {
      extractedText: mockReactText,
      chunks: mockChunks,
      status: "ready"
    }
  ).then(result => {
    console.log('✅ Document updated successfully!');
    console.log('New status:', result.status);
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ Update failed:', error);
    mongoose.connection.close();
  });
}).catch(error => {
  console.error('DB connection failed:', error);
});
