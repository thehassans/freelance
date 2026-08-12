import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { DatabaseService } from '../services/DatabaseService';
import { toast } from 'sonner';

export function usePremiumAction(toolId?: string) {
  const { user, isPro, aiUsageCount, showAuthModal, showProModal, consumeCredit } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const executeAction = async <T,>(actionCallback: (userId: string) => Promise<T> | T): Promise<T | undefined> => {
    if (!user?.uid) {
      showAuthModal('signup');
      return;
    }

    // Check credits if not pro
    if (!isPro && aiUsageCount >= 5) { // Assuming 5 is freemium limit, later we could read from config but aiUsageCount is managed by UserContext
      showProModal('Action Requires Pro');
      return;
    }

    setIsProcessing(true);
    try {
      // Execute consumeCredit before running action
      const success = await consumeCredit(toolId);
      if (!success) {
        // consumeCredit already handles toast and pro logic
        return;
      }
      
      const result = await actionCallback(user.uid);
      return result;
    } catch (error) {
      console.error("Action error:", error);
      toast.error('An error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return { executeAction, isProcessing, userId: user?.uid };
}
