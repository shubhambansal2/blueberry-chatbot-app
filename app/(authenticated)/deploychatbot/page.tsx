'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Card } from '../../../components/ui/Card';
import { fetchChatbots, Chatbot } from '../../../lib/chatbotsfetch';
import { 
  ShoppingCart, 
  Store, 
  Globe, 
  Layout, 
  Code, 
  Box,
  Paintbrush,
  Check,
  Copy,
  LifeBuoy,
  ExternalLink
} from 'lucide-react';

const websitePlatforms = [
  { 
    name: 'Shopify',
    icon: <ShoppingCart className="h-5 w-5 flex-shrink-0 text-emerald-600" />,
    instructions: [
      "1. Go to your Shopify admin panel",
      "2. Navigate to Online Store → Themes → Current theme → Edit HTML/CSS",
      "3. Open theme.liquid",
      "4. Paste the widget code just before the closing </body> tag"
    ]
  },
  { 
    name: 'Wix',
    icon: <Layout className="h-5 w-5 flex-shrink-0 text-blue-600" />,
    instructions: [
      "1. Go to your Wix Editor",
      "2. Click on the + button to add elements",
      "3. Choose 'Custom Code' from the menu",
      "4. Paste the widget code in the HTML box",
      "5. Click 'Apply' and publish your site"
    ]
  },
  { 
    name: 'Woocommerce',
    icon: <Store className="h-5 w-5 flex-shrink-0 text-purple-600" />,
    instructions: [
      "1. Access your WordPress dashboard",
      "2. Go to Appearance → Theme Editor",
      "3. Select your theme's footer.php file",
      "4. Add the widget code just before the closing </body> tag",
      "5. Update the file and clear your cache"
    ]
  },
  { 
    name: 'Bigcommerce',
    icon: <Box className="h-5 w-5 flex-shrink-0 text-orange-600" />,
    instructions: [
      "1. Go to your BigCommerce admin panel",
      "2. Navigate to Storefront → Script Manager",
      "3. Click 'Create a Script'",
      "4. Choose 'Footer' as the location",
      "5. Paste the widget code and save"
    ]
  },
  { 
    name: 'WordPress',
    icon: <Globe className="h-5 w-5 flex-shrink-0 text-blue-700" />,
    instructions: [
      "1. Log in to WordPress admin",
      "2. Go to Appearance → Theme Editor",
      "3. Select your theme's footer.php",
      "4. Paste the widget code before </body>",
      "5. Update file and clear cache"
    ]
  },
  { 
    name: 'Custom Website',
    icon: <Paintbrush className="h-5 w-5 flex-shrink-0 text-gray-700" />,
    instructions: [
      "1. Open your website's HTML file",
      "2. Locate the closing </body> tag",
      "3. Paste the widget code just before it",
      "4. Save and upload the changes",
      "5. Test the integration"
    ]
  },
  {
    name: 'Need Help?',
    icon: <LifeBuoy className="h-5 w-5 flex-shrink-0 text-green-600" />,
    instructions: [
      "Having trouble integrating the widget?",
      "Reach out to us at info@purpleberryai.com",
      "We'll help you get set up as soon as possible!"
    ]
  }
];

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightHTML = (code: string) => {
    const tokenize = (line: string) => {
      const tokens = [];
      let current = '';
      let inTag = false;
      let inString = false;
      let stringChar = null;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        // Handle tags
        if (char === '<' && !inString) {
          if (current) tokens.push({ type: 'text', content: current });
          current = char;
          inTag = true;
          continue;
        }
        if (char === '>' && inTag && !inString) {
          tokens.push({ type: 'tag', content: current + char });
          current = '';
          inTag = false;
          continue;
        }
        
        // Handle strings
        if ((char === '"' || char === "'") && !inString && inTag) {
          if (current) tokens.push({ type: 'tag', content: current });
          current = char;
          inString = true;
          stringChar = char;
          continue;
        }
        if (char === stringChar && inString) {
          tokens.push({ type: 'string', content: current + char });
          current = '';
          inString = false;
          stringChar = null;
          continue;
        }
        
        current += char;
      }
      
      if (current) {
        tokens.push({ 
          type: inTag ? 'tag' : inString ? 'string' : 'text', 
          content: current 
        });
      }
      
      return tokens;
    };

    return code.split('\n').map((line, i) => {
      const tokens = tokenize(line);
      
      return (
        <div key={i} className="leading-6">
          {tokens.map((token, j) => {
            if (token.type === 'tag') {
              // Special handling for script tags
              if (token.content.toLowerCase().includes('script')) {
                return <span key={j} className="text-yellow-400">{token.content}</span>;
              }
              return <span key={j} className="text-pink-400">{token.content}</span>;
            }
            if (token.type === 'string') {
              return <span key={j} className="text-emerald-300">{token.content}</span>;
            }
            // Handle attributes in text tokens within tags
            if (token.type === 'text' && token.content.includes('=')) {
              const coloredText = token.content.replace(/(\w+)=/g, 
                '<span class="text-sky-300">$1</span>=');
              return <span key={j} dangerouslySetInnerHTML={{ __html: coloredText }} />;
            }
            return <span key={j}>{token.content}</span>;
          })}
        </div>
      );
    });
  };

  const highlightJS = (code: string) => {
    const tokenize = (line: string) => {
      const tokens = [];
      let current = '';
      let inString = false;
      let stringChar = null;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        // Handle strings
        if ((char === '"' || char === "'" || char === '`') && line[i-1] !== '\\') {
          if (inString && char === stringChar) {
            tokens.push({ type: 'string', content: current + char });
            current = '';
            inString = false;
            stringChar = null;
          } else if (!inString) {
            if (current) tokens.push({ type: 'code', content: current });
            current = char;
            inString = true;
            stringChar = char;
          } else {
            current += char;
          }
          continue;
        }
        
        if (inString) {
          current += char;
          continue;
        }
        
        // Handle comments
        if (char === '/' && line[i+1] === '/') {
          if (current) tokens.push({ type: 'code', content: current });
          tokens.push({ type: 'comment', content: line.slice(i) });
          break;
        }
        
        current += char;
      }
      
      if (current) {
        tokens.push({ type: inString ? 'string' : 'code', content: current });
      }
      
      return tokens;
    };

    return code.split('\n').map((line, i) => {
      const tokens = tokenize(line);
      
      return (
        <div key={i} className="leading-6">
          {tokens.map((token, j) => {
            if (token.type === 'string') {
              return <span key={j} className="text-emerald-300">{token.content}</span>;
            }
            if (token.type === 'comment') {
              return <span key={j} className="text-gray-500">{token.content}</span>;
            }
            // Handle code
            const coloredCode = token.content
              .replace(/\b(const|let|var|function|return|import|export|from|default|async|await)\b/g, 
                '<span class="text-purple-400">$1</span>')
              .replace(/\b(class|extends)\b/g, 
                '<span class="text-blue-400">$1</span>')
              .replace(/\b(\w+)\(/g, 
                '<span class="text-yellow-300">$1</span>')
              .replace(/\b(\w+):/g, 
                '<span class="text-sky-300">$1</span>')
              .replace(/[{}[\]()]/g, 
                '<span class="text-gray-400">$&</span>');

            return <span key={j} dangerouslySetInnerHTML={{ __html: coloredCode }} />;
          })}
        </div>
      );
    });
  };

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm font-mono">
          {code.includes('<script') ? highlightHTML(code) : highlightJS(code)}
        </code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};


interface Integration {
  id: string;
  shop: string;
  platform: string;
  created_at: string;
}

const PlatformIntegration = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Shopify');
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isLoadingIntegration, setIsLoadingIntegration] = useState(false);
  const [shopName, setShopName] = useState('');
  const [isShopifyAdmin, setIsShopifyAdmin] = useState(false);

  // Check if user is in Shopify admin (shop parameter in URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    if (shop) {
      setIsShopifyAdmin(true);
      setShopName(shop);
      setSelectedPlatform('Shopify');
    }
  }, []);

   // Simulate fetching chatbots from backend
  const getChatbots = async () => {
    try {
      const chatbots = await fetchChatbots();
      setIsLoading(false);
      setChatbots(chatbots);
      // Auto-select the first chatbot if available
      if (chatbots.length > 0) {
        setSelectedChatbot(chatbots[0]);
      }
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    }
  };

  // Fetch integration data for selected chatbot
  const fetchIntegrationForChatbot = async (chatbot: Chatbot) => {
    setIsLoadingIntegration(true);
    try {
      // First, get the chatbot details to check if it has an integration_id
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/${chatbot.chatbot_id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chatbot details');
      }

      const chatbotData = await response.json();
      
      // If chatbot has integration_id, fetch the integration details
      if (chatbotData.integration_id) {
        const user = localStorage.getItem('user');
        if (user) {
          const integrationResponse = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_dataintegrations/${user}/`);
          const integrationData = await integrationResponse.json();
          
          if (integrationResponse.ok && integrationData.dataintegrations?.length > 0) {
            const integration = integrationData.dataintegrations.find((int: any) => int.id === chatbotData.integration_id);
            if (integration) {
              setSelectedIntegration({
                id: integration.id,
                shop: integration.shop,
                platform: 'Shopify',
                created_at: integration.created_at || new Date().toISOString()
              });
            }
          }
        }
      } else {
        setSelectedIntegration(null);
      }
    } catch (error) {
      console.error('Error fetching integration:', error);
      setSelectedIntegration(null);
    } finally {
      setIsLoadingIntegration(false);
    }
  };

  useEffect(() => {
    getChatbots();
    console.log(chatbots);
  }, []);

  // Fetch integration when chatbot is selected
  useEffect(() => {
    if (selectedChatbot) {
      fetchIntegrationForChatbot(selectedChatbot);
    } else {
      setSelectedIntegration(null);
    }
  }, [selectedChatbot]);

  const getWidgetCode = () => {
    if (!selectedChatbot) return '';
    return `<div id="chat-widget-container"></div>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/PurpleberryAI/Chatwidget/chatbot.bundle_v9.js"></script>
<script>
    // Initialize with configuration
    window.ChatWidget.render('chat-widget-container', {
        chatbotId: '${selectedChatbot.chatbot_id}',
        chatbotName: '${selectedChatbot.chatbot_name}',
        apiKey: '${selectedChatbot.api_key}'
    });
</script>`;
  };

  const handleShopifyDeploy = () => {
    if (selectedIntegration?.shop) {
      const shopname = selectedIntegration.shop.split('.')[0];
      console.log(shopname);
      // Construct the Shopify admin URL for theme editor
      const shopifyAdminUrl = `https://admin.shopify.com/store/${shopname}/themes/current/editor?context=apps`;
      window.open(shopifyAdminUrl, '_blank');
    }
  };

  const handleShopifyAppEmbed = () => {
    // Redirect to Shopify app embed page for the selected chatbot
    if (selectedChatbot) {
      const shopifyEmbedUrl = `https://admin.shopify.com/store/${shopName}/themes/current/editor?context=apps`;
      window.open(shopifyEmbedUrl, '_blank');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
    <Card className={`w-full ${isShopifyAdmin ? 'max-w-2xl mx-auto p-6 mt-10' : 'p-4 md:p-6'}`}>
      <h2 className={`font-semibold mb-6 text-center ${isShopifyAdmin ? 'text-2xl' : 'text-xl md:text-2xl'}`}>
        {isShopifyAdmin ? 'Chatbot Configuration' : 'Deploy Chatbot widget in your Website'}
      </h2>
      {/* Shopify Admin Mode: Multiple Chatbots */}
      {isShopifyAdmin && chatbots.length > 1 && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar for chatbot selection */}
          <div className="md:w-56 w-full mb-4 md:mb-0">
            <h3 className="text-base font-semibold mb-3 text-blue-800">Select Chatbot</h3>
            <div className="space-y-2">
              {chatbots.map((chatbot) => (
                <button
                  key={chatbot.chatbot_id}
                  onClick={() => setSelectedChatbot(chatbot)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors border border-gray-200 text-sm font-medium
                    ${selectedChatbot?.chatbot_id === chatbot.chatbot_id 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'hover:bg-blue-50'
                    }`}
                >
                  {chatbot.chatbot_name}
                </button>
              ))}
            </div>
          </div>
          {/* Main configuration area */}
          <div className="flex-1">
            {selectedChatbot && (
              <>
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Chatbot ID</label>
                      <input 
                        type="text" 
                        value={selectedChatbot.chatbot_id} 
                        readOnly 
                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">API Key</label>
                      <input 
                        type="text" 
                        value={selectedChatbot.api_key} 
                        readOnly 
                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Chatbot Name</label>
                      <input 
                        type="text" 
                        value={selectedChatbot.chatbot_name} 
                        readOnly 
                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (shopName) {
                        const shopName1 = shopName.split('.')[0];
                        window.open(`https://admin.shopify.com/store/${shopName1}/themes/current/editor?context=apps`, '_blank');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-semibold flex items-center gap-2 transition-colors shadow-md"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open Shopify Theme Editor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Shopify Admin Mode: Single Chatbot */}
      {isShopifyAdmin && chatbots.length === 1 && selectedChatbot && (
        <>
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Chatbot ID</label>
                <input 
                  type="text" 
                  value={selectedChatbot.chatbot_id} 
                  readOnly 
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">API Key</label>
                <input 
                  type="text" 
                  value={selectedChatbot.api_key} 
                  readOnly 
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Chatbot Name</label>
                <input 
                  type="text" 
                  value={selectedChatbot.chatbot_name} 
                  readOnly 
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-mono"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (shopName) {
                  const shopName1 = shopName.split('.')[0];
                  window.open(`https://admin.shopify.com/store/${shopName1}/themes/current/editor?context=apps`, '_blank');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-semibold flex items-center gap-2 transition-colors shadow-md"
            >
              <ExternalLink className="h-5 w-5" />
              Open Shopify Theme Editor
            </button>
          </div>
        </>
      )}
      {/* Non-Shopify Admin Mode: Show all platforms, chatbot selection, and integration code/link */}
      {!isShopifyAdmin && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar for platform selection */}
          <div className="md:w-56 w-full mb-4 md:mb-0">
            <h3 className="text-base font-semibold mb-3 text-blue-800">Select Platform</h3>
            <div className="space-y-2">
              {websitePlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => setSelectedPlatform(platform.name)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors border border-gray-200 text-sm font-medium
                    ${selectedPlatform === platform.name 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'hover:bg-secondary/20'
                    }`}
                >
                  <span className="mr-2">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
          {/* Sidebar for chatbot selection */}
          <div className="md:w-56 w-full mb-4 md:mb-0">
            <h3 className="text-base font-semibold mb-3 text-blue-800">Select Chatbot</h3>
            <div className="space-y-2">
              {chatbots.map((chatbot) => (
                <button
                  key={chatbot.chatbot_id}
                  onClick={() => setSelectedChatbot(chatbot)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors border border-gray-200 text-sm font-medium
                    ${selectedChatbot?.chatbot_id === chatbot.chatbot_id 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'hover:bg-blue-50'
                    }`}
                >
                  {chatbot.chatbot_name}
                </button>
              ))}
            </div>
          </div>
          {/* Main content area */}
          <div className="flex-1">
            {selectedPlatform && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                  {selectedPlatform === 'Need Help?' ? selectedPlatform : `Deploy to ${selectedPlatform}`}
                </h3>
                {selectedPlatform !== 'Need Help?' && (
                  <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
                    {websitePlatforms.find(p => p.name === selectedPlatform)?.instructions.map((instruction, index) => (
                      <span key={index} className="block mb-1">{instruction}</span>
                    ))}
                  </p>
                )}
                {/* Shopify: Show App Embed link, not code */}
                {selectedPlatform === 'Shopify' ? (
                  <div className="mb-4 md:mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Enter your Shopify store name
                          </p>
                          <p className="text-xs text-blue-600">
                            For example: neo-balance-shoes.myshopify.com
                          </p>
                          <input 
                            type="text"
                            placeholder="your-store-name"
                            className="mt-2 w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
                            onChange={(e) => setShopName(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              if (shopName) {
                                const shopName1 = shopName.split('.')[0];
                                window.open(`https://admin.shopify.com/store/${shopName1}/themes/current/editor?context=apps`, '_blank');
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Continue to App Embed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Other platforms: Show integration code
                  <div className="mb-4 md:mb-6">
                    <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Integration Code</h4>
                    <CodeBlock code={getWidgetCode()} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* WhatsApp/Instagram section for non-Shopify admin */}
      {!isShopifyAdmin && (
        <Card className='mt-6 md:mt-10 w-full p-4 md:p-6'>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Deploy your Chatbots to Whatsapp and Instagram Business</h2>
          <button className='bg-primary text-primary-foreground px-3 md:px-4 py-2 rounded-lg text-sm md:text-base'>
            Coming Soon
          </button>
        </Card>
      )}
    </Card>
  </div>
);
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlatformIntegration />
    </Suspense>
  );
}