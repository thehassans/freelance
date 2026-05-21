import { useUser } from '../contexts/UserContext';
import { getAnonymousUses, incrementAnonymousUses } from '../lib/storage';
import { toast } from 'sonner';

export function useProtectedExport() {
  const { user, isPro, aiUsageCount, showProModal, showLeadCapture, consumeCredit } = useUser();

  const handleProtectedExport = (exportAction: () => void, featureName: string) => {
    // State 1: Guest, 0 Uses
    const anonymousUses = getAnonymousUses();
    
    if (!user) {
      if (anonymousUses === 0) {
        exportAction();
        incrementAnonymousUses();
        toast.success('PDF Exported!', {
          description: '🔒 Create a free account to claim 4 more free exports this month.',
          duration: 6000,
        });
        return;
      } else {
        // State 2: Guest, 1+ Uses
        showLeadCapture(featureName);
        return;
      }
    }

    // State 3: Logged In, < 5 Uses
    if (!isPro) {
      if (aiUsageCount < 5) {
        exportAction();
        consumeCredit();
        toast.success('PDF Exported!', {
          description: `You have ${4 - aiUsageCount} free exports remaining this month.`,
        });
        return;
      } else {
        // State 4: Logged In, >= 5 Uses
        showProModal(featureName);
        return;
      }
    }

    // Pro User: Always allow
    exportAction();
  };

  return { handleProtectedExport };
}
