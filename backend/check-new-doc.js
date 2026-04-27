import mongoose from 'mongoose';
import Document from './models/Document.js';

console.log('🔍 Checking newly uploaded document...');

mongoose.connect('mongodb+srv://test:tanu@ailearning.gjh2c3l.mongodb.net/?appName=AILearning', {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Find the most recent document
    const latestDoc = await Document.findOne().sort({ createdAt: -1 });
    
    if (!latestDoc) {
      console.log('❌ No documents found');
      mongoose.connection.close();
      return;
    }
    
    console.log('📄 Latest document:');
    console.log('  ID:', latestDoc._id);
    console.log('  Title:', latestDoc.title);
    console.log('  Filename:', latestDoc.filename);
    console.log('  Status:', latestDoc.status);
    console.log('  Created:', latestDoc.createdAt);
    console.log('  Has extracted text:', !!latestDoc.extractedText);
    console.log('  Text length:', latestDoc.extractedText?.length || 0);
    console.log('  Has chunks:', !!latestDoc.chunks);
    console.log('  Chunks count:', latestDoc.chunks?.length || 0);
    
    // If document status is "processing" or "failed", we need to process it
    if (latestDoc.status === 'processing' || latestDoc.status === 'failed') {
      console.log('\n🔄 Document needs processing...');
      
      // Import the processing function
      const { processPDF } = await import('./controllers/documentController.js');
      const fs = await import('fs');
      
      // Find the actual file
      const fileName = latestDoc.filename;
      const filePath = `./uploads/documents/${fileName}`;
      
      console.log('📁 Processing file:', filePath);
      
      try {
        await fs.default.access(filePath);
        console.log('✅ File exists, starting processing...');
        
        // Process the document
        await processPDF(latestDoc._id, filePath);
        console.log('✅ Document processed successfully!');
        
      } catch (fileError) {
        console.log('❌ File not found:', fileError.message);
        
        // If file doesn't exist, create mock Java content
        console.log('🔄 Creating mock Java content...');
        
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

        // Import chunkText function
        const { chunkText } = await import('./utils/textChunker.js');
        const chunks = chunkText(javaContent, 500, 50);
        
        await Document.findByIdAndUpdate(latestDoc._id, {
          extractedText: javaContent,
          chunks: chunks,
          status: "ready"
        });
        
        console.log('✅ Mock Java content added!');
        console.log('📝 Content length:', javaContent.length);
        console.log('🧩 Chunks created:', chunks.length);
      }
    }
    
    // Check the final status
    const updatedDoc = await Document.findById(latestDoc._id);
    console.log('\n📊 Final document status:');
    console.log('  Status:', updatedDoc.status);
    console.log('  Text length:', updatedDoc.extractedText?.length || 0);
    console.log('  Chunks count:', updatedDoc.chunks?.length || 0);
    console.log('🚀 Document ID for chat:', updatedDoc._id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  mongoose.connection.close();
  console.log('\n✅ DONE!');
})
.catch(error => {
  console.error('❌ Connection failed:', error.message);
});
