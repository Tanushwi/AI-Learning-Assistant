// Simple test without database dependency
const testChatWithMockData = async () => {
  try {
    console.log('🧪 Testing chat API with mock document data...');
    
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
      console.log('Response type:', typeof data.response);
      console.log('Response length:', data.response?.length || 0);
    } else {
      console.log('❌ Chat failed:', data.error);
      console.log('Error code:', data.statusCode);
    }
    
  } catch (error) {
    console.error('❌ Chat test error:', error.message);
  }
};

testChatWithMockData();
