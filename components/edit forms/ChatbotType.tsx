import { useForm } from 'react-hook-form';
import { editChatbotStore } from '../../store/editChatbotStore';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Bot, MessageSquare, Users, CheckCircle, AlertCircle, Loader2, Lock, Info } from 'lucide-react';
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
    const { agentType, updateAgentType } = editChatbotStore();
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
                        const accessToken = await getShopAccessToken(shopFromUrl);
                        if (accessToken) {
                            const features = await checkSubscriptionAndFeatures(
                                shopFromUrl, 
                                accessToken
                            );
                            setSubscriptionFeatures(features);
                        }
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

    // Update store when selectedType changes (only for create mode, not edit mode)
    useEffect(() => {
        if (selectedType === 'sales') {
            updateAgentType({ isSalesAgent: true, isSupportAgent: false });
        } else if (selectedType === 'support') {
            updateAgentType({ isSalesAgent: false, isSupportAgent: true });
        }
    }, [selectedType, updateAgentType]);

    const handleTypeSelection = (type: string) => {
        // Disable selection in edit mode
        return;
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

    return (
        <div className="w-full max-w-6xl mx-auto p-8">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <Bot className="w-12 h-12 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Type</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Your agent type has been set and cannot be changed. This ensures consistency with your existing chatbot configuration.
                </p>
                
                {/* Locked Message */}
                <div className="mt-6 flex items-center justify-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-800 font-medium text-sm">
                        Agent type is locked and cannot be modified
                    </span>
                </div>

                {/* Subscription Status Info */}
                {subscriptionFeatures.subscriptionName && (
                    <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 text-sm">
                            Current subscription: {subscriptionFeatures.subscriptionName} ({subscriptionFeatures.subscriptionStatus})
                        </span>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading agent configuration...</span>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && selectedType && (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Selection Panel - Disabled */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Current Agent Type</h2>
                        
                        {/* Sales Agent Option - Disabled */}
                        <div className={`group relative rounded-xl border-2 transition-all duration-200 ${
                            selectedType === 'sales' ? 
                                'border-blue-500 bg-blue-50 shadow-md' : 
                                'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}>
                            <div className="w-full p-4 text-left">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            selectedType === 'sales' ? 'bg-blue-100' : 'bg-gray-200'
                                        }`}>
                                            <Users className={`w-5 h-5 ${
                                                selectedType === 'sales' ? 'text-blue-600' : 'text-gray-400'
                                            }`} />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-base ${
                                                selectedType === 'sales' ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                                Sales Agent + FAQ Support
                                            </h3>
                                            <p className={`text-sm mt-1 ${
                                                selectedType === 'sales' ? 'text-gray-600' : 'text-gray-400'
                                            }`}>
                                                Advanced AI agent for sales and customer support
                                            </p>
                                        </div>
                                    </div>
                                    {selectedType === 'sales' && (
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Support Agent Option - Disabled */}
                        <div className={`group relative rounded-xl border-2 transition-all duration-200 ${
                            selectedType === 'support' ? 
                                'border-green-500 bg-green-50 shadow-md' : 
                                'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}>
                            <div className="w-full p-4 text-left">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            selectedType === 'support' ? 'bg-green-100' : 'bg-gray-200'
                                        }`}>
                                            <MessageSquare className={`w-5 h-5 ${
                                                selectedType === 'support' ? 'text-green-600' : 'text-gray-400'
                                            }`} />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-base ${
                                                selectedType === 'support' ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                                FAQ Customer Support
                                            </h3>
                                            <p className={`text-sm text-gray-600 mt-1 ${
                                                selectedType === 'support' ? 'text-gray-600' : 'text-gray-400'
                                            }`}>
                                                Specialized AI agent for customer support and FAQs
                                            </p>
                                        </div>
                                    </div>
                                    {selectedType === 'support' && (
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="lg:pl-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Agent Details</h2>
                            <p className="text-gray-600 mb-4">
                                Here are the key capabilities and features of your current agent:
                            </p>
                            {getCapabilityDetails(selectedType)}
                        </div>
                    </div>
                </div>
            )}

            {/* No Type Selected State */}
            {!isLoading && !selectedType && (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-center">
                        <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No agent type found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Please check your chatbot configuration
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotTypeForm;