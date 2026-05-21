import { create } from 'zustand';

interface InvoicePayload {
  itemName: string;
  quantity: number;
  rate: number;
  description?: string;
}

interface ProposalPayload {
  clientName?: string;
  projectType: string;
  estimatedPrice?: number;
  keyRequirements?: string[];
  contextString?: string;
}

interface EcosystemState {
  invoicePayload: InvoicePayload | null;
  proposalPayload: ProposalPayload | null;
  
  // Actions
  setInvoicePayload: (payload: InvoicePayload | null) => void;
  setProposalPayload: (payload: ProposalPayload | null) => void;
  clearAllPayloads: () => void;
}

export const useEcosystemStore = create<EcosystemState>((set) => ({
  invoicePayload: null,
  proposalPayload: null,

  setInvoicePayload: (payload) => set({ invoicePayload: payload }),
  setProposalPayload: (payload) => set({ proposalPayload: payload }),
  
  clearAllPayloads: () => set({ 
    invoicePayload: null, 
    proposalPayload: null 
  }),
}));
