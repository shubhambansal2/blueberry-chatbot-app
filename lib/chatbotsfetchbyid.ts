export interface Chatbot {
    chatbot_id: number;
    chatbot_name: string;
    company_name: string;
    role: string;
    personality: string;
  }

function getToken(maxAttempts = 10, interval = 500): Promise<string | null> {
    return new Promise((resolve) => {
      let attempts = 0;
  
      function checkToken() {
        const token = localStorage.getItem('accessToken');
        if (token) {
          resolve(token);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkToken, interval);
        } else {
          resolve(null);
        }
      }
  
      checkToken();
    });
  }
  
  
  export const fetchChatbotById = async (id: number): Promise<Chatbot> => {
    try {
      const token = await getToken();
      console.log('Token from localStorage:', token);
      if (!token) {
        throw new Error('No access token available');
      }
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
      return chatbot;
    } catch (error) {
      console.error('Error fetching chatbot:', error);
      throw error;
    }
  };