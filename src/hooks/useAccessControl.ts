import { useUser } from '../contexts/UserContext';
import { Tool } from '../types';

export function useAccessControl() {
  const { user, tier, loading } = useUser();

  const canAccess = (tool: Tool) => {
    if (loading) return true; // optimistic
    
    if (tool.tier === 'PRO') {
      return tier === 'PRO';
    }
    
    // Freemium is accessible by all, but internal logic handles watermarks
    return true; 
  };

  const hasWatermark = () => {
    return tier !== 'PRO';
  };

  const getLimit = (feature: string) => {
    if (tier === 'PRO') return Infinity;
    
    // Example limits
    const limits: Record<string, number> = {
      'ai-generations': 2,
      'portfolio-exports': 1,
    };
    
    return limits[feature] || 0;
  };

  return {
    canAccess,
    hasWatermark,
    getLimit,
    isPro: tier === 'PRO',
    userTier: tier,
    isLoading: loading,
    isAuthenticated: !!user
  };
}
