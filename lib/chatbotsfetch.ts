import axios from 'axios';

export interface Chatbot {
  chatbot_id: number;
  chatbot_name: string;
  company_name: string;
  role: string;
  personality: string;
  api_key: string;
  is_product_recommender?: boolean;
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

// Function to check if user has active Sales and FAQ Chatbot subscription
export const checkSalesAndFaqSubscription = async (shop: string): Promise<boolean> => {
  try {
    const { checkSubscriptionAndFeatures, getShopAccessToken } = await import('./shopifySubscription');
    const accessToken = await getShopAccessToken(shop);
    
    if (!accessToken) {
      console.log('No access token available for shop:', shop);
      return false;
    }

    const features = await checkSubscriptionAndFeatures(shop, accessToken);
    return features.hasSalesAndFaqAccess;
  } catch (error) {
    console.error('Error checking Sales and FAQ subscription:', error);
    return false;
  }
};