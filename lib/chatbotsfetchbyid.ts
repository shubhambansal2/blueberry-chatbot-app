export interface Chatbot {
  chatbot_id: number;
  chatbot_name: string;
  company_name: string;
  role: string;
  personality: string;
}

function debugToken() {
  console.log('Current token in localStorage:', localStorage.getItem('accessToken'));
}

function getToken(maxAttempts = 20, interval = 250): Promise<string | null> {
  return new Promise((resolve) => {
      let attempts = 0;

      function checkToken() {
          const token = localStorage.getItem('accessToken');
          console.log(`Attempt ${attempts + 1}: Token is ${token ? 'present' : 'not present'}`);
          if (token) {
              resolve(token);
          } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkToken, interval);
          } else {
              console.log('Max attempts reached, no token found');
              resolve(null);
          }
      }

      checkToken();
  });
}

export const fetchChatbotById = async (id: number): Promise<Chatbot> => {
  console.log('fetchChatbotById called for id:', id);

  // Set up event listener to receive the token from the parent window
  window.addEventListener('message', (event) => {
    // Ensure the message is from the expected origin]
    console.log('Message received:', event.data);
    console.log('Message origin:', event.origin);
    if (event.origin !== 'https://mighty-dusk-63104-f38317483204.herokuapp.com') {
        console.log('Origin mismatch. Message ignored.');
        return; // Ignore messages from other origins
        
    }

    if (event.data.type === 'AUTH_TOKEN') {
        const token = event.data.token;
        localStorage.setItem('accessToken', token);
        console.log('Token received and stored:', token);
    }
}, false);

  try {
      console.log('Attempting to get token...');
      const token = await getToken();
      console.log('Token retrieval result:', token);

      if (!token) {
          throw new Error('No access token available');
      }

      console.log('Making API call with token...');
      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/${id}/`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch chatbot');
      }

      const chatbot: Chatbot = await response.json();
      console.log('Chatbot fetched successfully:', chatbot);
      return chatbot;
  } catch (error) {
      console.error('Error in fetchChatbotById:', error);
      throw error;
  }
};