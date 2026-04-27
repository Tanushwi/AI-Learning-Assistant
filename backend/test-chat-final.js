import axios from 'axios';

console.log('🧪 TESTING CHAT ENDPOINT...');

const testChat = async () => {
  try {
    console.log('📤 Sending test request...');
    
    const response = await axios.post('http://localhost:8000/api/ai/chat', {
      documentId: '69c6bcf39a1e4119cc92dd34',
      question: 'what is java'
    });
    
    console.log('✅ Response received:', response.data);
    console.log('📝 Answer:', response.data?.data?.answer);
    console.log('📊 Status:', response.status);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('❌ Full error:', error);
  }
};

testChat();
