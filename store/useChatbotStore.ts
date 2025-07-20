import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileData = {
  file: File | null;
  preview: string;
};

export interface Integration {
  id: string;
  shop: string;
  platform: string;
  created_at: string;
}

interface CompanyDetails {
  companyName: string;
  industry: string;
  companyDetails?: string;
  logo?: FileData | null;
}

interface AgentType {
  isSalesAgent: boolean;
  isSupportAgent: boolean;
}

interface ChatbotColor {
  id: string;
  value: string;
  name: string;
}

interface ChatbotDetails {
  name: string;
  avatar?: FileData | null;
  personality: string;
  description: string;
  primaryLanguage: string;
  color: ChatbotColor | null;
}

interface SpecialInstructions {
  specialinstructions: string;
  exampleresponses: Array<{ question: string; answer: string }>;
}

interface DataSources {
  websites: Array<{ value: string }>;  // Updated to match FieldArray requirements
  documents: FileData[];
  selectedIntegration?: Integration | null;
}

interface Activation {
  isActive: boolean;
  startDate: string;
  endDate: string;
  allowedDomains: string[];
}

interface Deployment {
  platform: string;
  configuration: Record<string, any>;
  customCSS?: string;
  customScripts?: FileData[];
}

export type ChatbotState = {
  agentType: AgentType;
  companyDetails: CompanyDetails;
  chatbotDetails: ChatbotDetails;
  specialInstructions: SpecialInstructions;
  dataSources: DataSources;
  activation: Activation;
  deployment: Deployment;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  updateAgentType: (type: Partial<AgentType>) => void;
  updateCompanyDetails: (details: Partial<CompanyDetails>) => void;
  updateChatbotDetails: (details: Partial<ChatbotDetails>) => void;
  updateSpecialInstructions: (instructions: Partial<SpecialInstructions>) => void;
  updateDataSources: (sources: Partial<DataSources>) => void;
  updateActivation: (activation: Partial<Activation>) => void;
  updateDeployment: (deployment: Partial<Deployment>) => void;
  resetForm: () => void;
  resetChatbotDetails: () => void;
};

const initialState = {
  agentType: {
    isSalesAgent: false,
    isSupportAgent: false,
  },
  companyDetails: {
    companyName: '',
    industry: '',
    website: '',
    companyDetails: '',
    logo: null,
  },
  chatbotDetails: {
    name: '',
    description: '',
    primaryLanguage: '',
    avatar: null,
    personality: '',
    color: null,
  },
  specialInstructions: {
    specialinstructions: '',
    exampleresponses: [],
  },
  dataSources: {
    websites: [{ value: '' }], // Updated initial state to match new type
    documents: [],
    selectedIntegration: null,
  },
  activation: {
    isActive: false,
    startDate: '',
    endDate: '',
    allowedDomains: [],
  },
  deployment: {
    platform: '',
    configuration: {},
    customCSS: '',
    customScripts: [],
  },
  currentStep: 'chatbot-details',
};

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStep: (step) => set({ currentStep: step }),
      updateAgentType: (type) => set({ agentType: { ...initialState.agentType, ...type } }),
      updateCompanyDetails: (details) =>
        set((state) => ({
          companyDetails: { ...state.companyDetails, ...details },
        })),
      updateChatbotDetails: (details) =>
        set((state) => ({
          chatbotDetails: { ...state.chatbotDetails, ...details },
        })),
      updateSpecialInstructions: (instructions) =>
        set((state) => ({
          specialInstructions: { ...state.specialInstructions, ...instructions },
        })),
      updateDataSources: (sources) =>
        set((state) => ({
          dataSources: { ...state.dataSources, ...sources },
        })),
      updateActivation: (activation) =>
        set((state) => ({
          activation: { ...state.activation, ...activation },
        })),
      updateDeployment: (deployment) =>
        set((state) => ({
          deployment: { ...state.deployment, ...deployment },
        })),
      resetForm: () => set(initialState),
      resetChatbotDetails: () => set({
        chatbotDetails: initialState.chatbotDetails,
        companyDetails: initialState.companyDetails
      }),
    }),
    {
      name: 'chatbot-form-storage',
    }
  )
);