// Test chat API directly

const testChat = async () => {
  try {
    console.log('🧪 Testing chat API with Java document...');
    
    const response = await fetch('http://localhost:8000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId: '69c52dfa989a9f5a1e0b2b45', // Java document ID
        question: 'what is java programming language'
      })
    });
    
    const data = await response.json();
    console.log('Chat API response status:', response.status);
    console.log('Chat API response:', data);
    
    if (data.success) {
      console.log('✅ Chat response:', data.response);
    } else {
      console.log('❌ Chat failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Chat test error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testChat();
