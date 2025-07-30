import { useForm } from 'react-hook-form';
import { useChatbotStore } from '../../store/useChatbotStore';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Bot, MessageSquare, Users, CheckCircle, AlertCircle, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { checkSubscriptionAndFeatures, getShopAccessToken } from '../../lib/shopifySubscription';
import { useShop } from '../ShopContext';

const ChatbotTypeForm = () => {
    const [dataIntegrations, setDataIntegrations] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionFeatures, setSubscriptionFeatures] = useState<{
        hasSalesAndFaqAccess: boolean;
        hasFaqOnlyAccess: boolean;
        subscriptionName?: string;
        subscriptionStatus?: string;
    }>({
        hasSalesAndFaqAccess: false,
        hasFaqOnlyAccess: false
    });
    const { agentType, updateAgentType } = useChatbotStore();
    const shopFromUrl = useShop();
    
    // Initialize selectedType based on store state
    const [selectedType, setSelectedType] = useState<string | null>(() => {
        if (agentType.isSalesAgent && !agentType.isSupportAgent) return 'sales';
        else if (agentType.isSupportAgent && !agentType.isSalesAgent) return 'support';
        return null;
    });

    useEffect(() => {
        const checkExistingIntegrations = async () => {
            setIsLoading(true);
            try {
                const user = localStorage.getItem('user');
                if (!user) {
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_dataintegrations/${user}/`);
                const data = await response.json();

                if (response.ok && data.dataintegrations?.length > 0) {
                    setDataIntegrations(data.dataintegrations);
                    
                    // Only check subscription for the shop from URL parameter
                    if (shopFromUrl) {
                        console.log('ChatbotTypeForm: Checking subscription for shop:', shopFromUrl);
                        const accessToken = await getShopAccessToken(shopFromUrl);
                        if (accessToken) {
                            const features = await checkSubscriptionAndFeatures(
                                shopFromUrl, 
                                accessToken
                            );
                            setSubscriptionFeatures(features);
                            console.log('ChatbotTypeForm: Subscription features:', features);
                        }
                    } else {
                        console.log('ChatbotTypeForm: No shop parameter, skipping subscription check');
                        // If no shop parameter, assume user has access (no restrictions)
                        setSubscriptionFeatures({
                            hasSalesAndFaqAccess: true,
                            hasFaqOnlyAccess: true
                        });
                    }
                } else {
                    setDataIntegrations(null);
                }
            } catch (error) {
                console.error('Error checking integrations:', error);
                setDataIntegrations(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkExistingIntegrations();
    }, [shopFromUrl]);

    // Update store when selectedType changes
    useEffect(() => {
        if (selectedType === 'sales') {
            updateAgentType({ isSalesAgent: true, isSupportAgent: false });
        } else if (selectedType === 'support') {
            updateAgentType({ isSalesAgent: false, isSupportAgent: true });
        }
    }, [selectedType, updateAgentType]);

    const handleTypeSelection = (type: string) => {
        // Only allow selection if the feature is available
        if (type === 'sales' && !subscriptionFeatures.hasSalesAndFaqAccess && shopFromUrl) {
            console.log('ChatbotTypeForm: Sales agent selection blocked - no subscription');
            return; // Don't allow selection of sales agent if not available and shop parameter is present
        }
        setSelectedType(type);
    };

    const getCapabilityDetails = (type: string) => {
        const capabilities = {
            sales: {
                title: "Sales Agent Capabilities",
                icon: <Users className="w-5 h-5 text-blue-600" />,
                color: "blue",
                items: [
                    "Handles complex sales conversations",
                    "Product recommendations",
                    "Price negotiations",
                    "Lead qualification",
                    "Integration with CRM systems"
                ]
            },
            support: {
                title: "FAQ Support Capabilities",
                icon: <MessageSquare className="w-5 h-5 text-green-600" />,
                color: "green",
                items: [
                    "Answers frequently asked questions",
                    "Basic troubleshooting",
                    "Product information",
                    "Service details",
                    "24/7 automated support"
                ]
            }
        };

        const capability = capabilities[type as keyof typeof capabilities];
        if (!capability) return null;

        return (
            <div className={`mt-6 p-6 bg-gradient-to-br from-${capability.color}-50 to-${capability.color}-100 rounded-xl border border-${capability.color}-200 shadow-sm`}>
                <div className="flex items-center gap-3 mb-4">
                    {capability.icon}
                    <h3 className="font-semibold text-lg text-gray-800">{capability.title}</h3>
                </div>
                <div className="space-y-3">
                    {capability.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckCircle className={`w-4 h-4 text-${capability.color}-600 mt-0.5 flex-shrink-0`} />
                            <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Determine if sales agent option should be disabled
    // Only disable if shop parameter is present AND user doesn't have subscription
    const isSalesAgentDisabled = !dataIntegrations || (!!shopFromUrl && !subscriptionFeatures.hasSalesAndFaqAccess);
    
    // Use shop from URL parameter for upgrade link
    const currentShop = shopFromUrl?.split('.')[0];

    console.log('ChatbotTypeForm: Shop parameter:', shopFromUrl);
    console.log('ChatbotTypeForm: Is sales agent disabled:', isSalesAgentDisabled);
    console.log('ChatbotTypeForm: Has data integrations:', !!dataIntegrations);
    console.log('ChatbotTypeForm: Has sales and FAQ access:', subscriptionFeatures.hasSalesAndFaqAccess);

    return (
        <div className="w-full max-w-6xl mx-auto p-8">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <Bot className="w-12 h-12 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your AI Agent Type</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Select the type of AI agent that best fits your business needs. Each agent type comes with specialized capabilities tailored for different use cases.
                </p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading integrations...</span>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Selection Panel */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Agent Types</h2>
                        
                        {/* Sales Agent Option */}
                        <div className={`group relative rounded-xl border-2 transition-all duration-200 ${
                            isSalesAgentDisabled ? 
                                'border-gray-200 bg-gray-50 cursor-not-allowed' :
                                selectedType === 'sales' ? 
                                    'border-blue-500 bg-blue-50 shadow-md' : 
                                    'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                        }`}>
                            <button
                                className="w-full p-4 text-left disabled:cursor-not-allowed"
                                onClick={() => handleTypeSelection('sales')}
                                disabled={isSalesAgentDisabled}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            isSalesAgentDisabled ? 'bg-gray-200' : 'bg-blue-100'
                                        }`}>
                                            <Users className={`w-5 h-5 ${
                                                isSalesAgentDisabled ? 'text-gray-400' : 'text-blue-600'
                                            }`} />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-base ${
                                                isSalesAgentDisabled ? 'text-gray-400' : 'text-gray-900'
                                            }`}>
                                                Sales Agent + FAQ Support
                                            </h3>
                                            <p className={`text-sm mt-1 ${
                                                isSalesAgentDisabled ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                Advanced AI agent for sales and customer support
                                            </p>
                                        </div>
                                    </div>
                                    {selectedType === 'sales' && (
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    )}
                                </div>
                                
                                {!dataIntegrations && (
                                    <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-red-700">
                                                This option requires data integrations to be configured.
                                            </span>
                                            <Link 
                                                href="/dataintegrations" 
                                                className="text-sm font-medium text-red-700 hover:text-red-800 underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Configure now
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {dataIntegrations && shopFromUrl && !subscriptionFeatures.hasSalesAndFaqAccess && (
                                    <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                        <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-amber-700">
                                                This feature requires the Sales & FAQ Agent subscription.
                                            </span>
                                            {currentShop && (
                                                <a 
                                                    href={`https://admin.shopify.com/store/${currentShop}/charges/purpleberry-chatbot/pricing_plans`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Upgrade now
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Support Agent Option */}
                        <div className={`group relative rounded-xl border-2 transition-all duration-200 ${
                            selectedType === 'support' ? 
                                'border-green-500 bg-green-50 shadow-md' : 
                                'border-gray-200 hover:border-green-300 hover:shadow-sm bg-white'
                        }`}>
                            <button
                                className="w-full p-4 text-left"
                                onClick={() => handleTypeSelection('support')}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-green-100">
                                            <MessageSquare className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-base text-gray-900">
                                                FAQ Customer Support
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Specialized AI agent for customer support and FAQs
                                            </p>
                                        </div>
                                    </div>
                                    {selectedType === 'support' && (
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="lg:pl-6">
                        {selectedType ? (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Selected Agent Details</h2>
                                <p className="text-gray-600 mb-4">
                                    Here are the key capabilities and features of your selected agent:
                                </p>
                                {getCapabilityDetails(selectedType)}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <div className="text-center">
                                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">Select an agent type</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Choose an option to see detailed capabilities
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Button
            {!isLoading && selectedType && (
                <div className="mt-10 text-center">
                    <button className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                        selectedType === 'sales' ? 
                            'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl' : 
                            'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                    }`}>
                        Continue with {selectedType === 'sales' ? 'Sales Agent' : 'FAQ Support'}
                    </button>
                </div> */}
            {/* )} */}
        </div>
    );
};

export default ChatbotTypeForm;