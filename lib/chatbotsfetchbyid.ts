export interface Chatbot {
    chatbot_id: number;
    chatbot_name: string;
    company_name: string;
    role: string;
    personality: string;
  }
  
  
  export const fetchChatbotById = async (id: number): Promise<Chatbot> => {
    try {
      const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
      console.log('Token from localStorage:', token)
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