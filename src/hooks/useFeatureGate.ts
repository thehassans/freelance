import { useUser } from '../contexts/UserContext';

export function useFeatureGate() {
  const { isPro, showProModal } = useUser();

  const requirePro = (featureName: string, action: () => void) => {
    if (isPro) {
      action();
    } else {
      showProModal(featureName);
    }
  };

  return { requirePro };
}
