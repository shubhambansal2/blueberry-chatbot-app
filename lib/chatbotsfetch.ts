import axios from 'axios';

export interface Chatbot {
  chatbot_id: number;
  chatbot_name: string;
  company_name: string;
  role: string;
  personality: string;
}

export const fetchChatbots = async (): Promise<Chatbot[]> => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return [];
  }
};