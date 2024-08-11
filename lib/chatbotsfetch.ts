export interface Chatbot {
    chatbot_id: number;
    chatbot_name: string;
    company_name: string;
    role: string;
    personality: string;
  }
  
  export const fetchChatbots = async (): Promise<Chatbot[]> => {
    try {
      const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
      const response = await fetch('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }
  
      const chatbots: Chatbot[] = await response.json();
      return chatbots;
    } catch (error) {
      console.error('Error fetching chatbots:', error);
      throw error;
    }
  };