interface ShopifySubscription {
  id: string;
  name: string;
  status: string;
  test: boolean;
  lineItems: Array<{
    plan: {
      pricingDetails: {
        price: {
          amount: string;
        };
      };
    };
  }>;
}

interface ShopifySubscriptionResponse {
  data: {
    appInstallation: {
      activeSubscriptions: ShopifySubscription[];
    };
  };
  extensions: {
    cost: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export async function checkShopifySubscription(shop: string, accessToken: string): Promise<void> {
  try {
    console.log(`🔍 Checking subscription for shop: ${shop}`);
    
    const query = `
      query {
        appInstallation {
          activeSubscriptions {
            id
            name
            status
            test
            lineItems {
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Make the request through your backend to avoid CORS issues
    const response = await fetch('/api/shopify/check-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        shop,
        accessToken,
        query 
      }),
    });

    if (!response.ok) {
      console.error(`❌ API call failed for shop ${shop}:`, response.status, response.statusText);
      return;
    }

    const data: ShopifySubscriptionResponse = await response.json();
    
    if (data.data?.appInstallation?.activeSubscriptions?.length > 0) {
      const subscriptions = data.data.appInstallation.activeSubscriptions;
      console.log(`✅ Found ${subscriptions.length} active subscription(s) for shop ${shop}:`);
      
      subscriptions.forEach((subscription, index) => {
        console.log(`  Subscription ${index + 1}:`);
        console.log(`    ID: ${subscription.id}`);
        console.log(`    Name: ${subscription.name}`);
        console.log(`    Status: ${subscription.status}`);
        console.log(`    Test: ${subscription.test}`);
        
        if (subscription.lineItems?.length > 0) {
          subscription.lineItems.forEach((item, itemIndex) => {
            console.log(`    Line Item ${itemIndex + 1}:`);
            console.log(`      Price: $${item.plan.pricingDetails.price.amount}`);
          });
        }
      });
    } else {
      console.log(`ℹ️ No active subscriptions found for shop ${shop}`);
    }

  } catch (error) {
    console.error(`❌ Error checking subscription for shop ${shop}:`, error);
  }
}

export async function getShopAccessToken(shop: string): Promise<string | null> {
  try {
    const user = localStorage.getItem('user');
    if (!user) {
      console.error('No user found in localStorage');
      return null;
    }

    const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_dataintegrations/${user}/`);
    const data = await response.json();

    if (response.ok && data.dataintegrations?.length > 0) {
      const integration = data.dataintegrations.find((int: any) => int.shop === shop);
      if (integration) {
        // Log the integration to see its structure
        console.log('Found integration for shop:', shop, integration);
        
        // Access token is stored in the accessToken field
        const accessToken = integration.accessToken;
        
        if (accessToken) {
          console.log(`✅ Found access token for shop ${shop}`);
          return accessToken;
        } else {
          console.log(`❌ No access token found in integration data for shop ${shop}`);
          console.log('Integration data structure:', integration);
        }
      } else {
        console.log(`❌ No integration found for shop ${shop}`);
      }
    } else {
      console.log('No integrations found or API call failed');
    }
  } catch (error) {
    console.error('Error fetching integrations:', error);
  }

  return null;
} 

export async function checkSubscriptionAndFeatures(shop: string, accessToken: string): Promise<{
  hasSalesAndFaqAccess: boolean;
  hasFaqOnlyAccess: boolean;
  subscriptionName?: string;
  subscriptionStatus?: string;
}> {
  try {
    console.log(`🔍 Checking subscription features for shop: ${shop}`);
    
    const query = `
      query {
        appInstallation {
          activeSubscriptions {
            id
            name
            status
            test
            lineItems {
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Make the request through your backend to avoid CORS issues
    const response = await fetch('/api/shopify/check-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        shop,
        accessToken,
        query 
      }),
    });

    if (!response.ok) {
      console.error(`❌ API call failed for shop ${shop}:`, response.status, response.statusText);
      return {
        hasSalesAndFaqAccess: false,
        hasFaqOnlyAccess: false
      };
    }

    const data: ShopifySubscriptionResponse = await response.json();
    
    if (data.data?.appInstallation?.activeSubscriptions?.length > 0) {
      const subscriptions = data.data.appInstallation.activeSubscriptions;
      console.log(`✅ Found ${subscriptions.length} active subscription(s) for shop ${shop}:`);
      
      // Check for specific subscription types
      const salesAndFaqSubscription = subscriptions.find(sub => 
        (sub.name === 'Sales Agent Basic' && sub.status === 'ACTIVE')
        || (sub.name === 'Sales Agent Pro' && sub.status === 'ACTIVE')
      );
      
      const faqOnlySubscription = subscriptions.find(sub => 
        sub.name === 'FAQ Chatbot' && sub.status === 'ACTIVE'
      );
      
      if (salesAndFaqSubscription) {
        console.log(`✅ Found Sales & FAQ Agent subscription - all features enabled`);
        return {
          hasSalesAndFaqAccess: true,
          hasFaqOnlyAccess: true,
          subscriptionName: salesAndFaqSubscription.name,
          subscriptionStatus: salesAndFaqSubscription.status
        };
      } else if (faqOnlySubscription) {
        console.log(`ℹ️ Found FAQ Chatbot subscription - FAQ features only`);
        return {
          hasSalesAndFaqAccess: false,
          hasFaqOnlyAccess: true,
          subscriptionName: faqOnlySubscription.name,
          subscriptionStatus: faqOnlySubscription.status
        };
      } else {
        console.log(`ℹ️ No recognized subscription found - no features enabled`);
        return {
          hasSalesAndFaqAccess: false,
          hasFaqOnlyAccess: false
        };
      }
    } else {
      console.log(`ℹ️ No active subscriptions found for shop ${shop}`);
      return {
        hasSalesAndFaqAccess: false,
        hasFaqOnlyAccess: false
      };
    }

  } catch (error) {
    console.error(`❌ Error checking subscription features for shop ${shop}:`, error);
    return {
      hasSalesAndFaqAccess: false,
      hasFaqOnlyAccess: false
    };
  }
}