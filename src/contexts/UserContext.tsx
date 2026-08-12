import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, loginWithGoogle, isConfigValid } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp, increment, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

import { useSystemConfigs } from './SystemConfigContext';
import { DatabaseService } from '../services/DatabaseService';

export type UserTier = 'FREE' | 'PRO';

interface UserContextType {
  tier: UserTier;
  setTier: (tier: UserTier) => void;
  user: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isPro: boolean;
  aiUsageCount: number;
  incrementAiUsage: () => void;
  consumeCredit: (toolIdOrCost?: string | number) => Promise<boolean>;
  showProModal: (featureName?: string) => void;
  closeProModal: () => void;
  isProModalOpen: boolean;
  proModalFeature: string;
  showLeadCapture: (featureName?: string) => void;
  closeLeadCapture: () => void;
  isLeadCaptureOpen: boolean;
  toggleProMode: () => void;
  showAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authInitialMode: 'login' | 'signup';
  isHydrated: boolean;
  currency: string;
  updateCurrency: (currency: string) => void;
  updateProfile: (data: { name?: string; email?: string; currency?: string }) => Promise<void>;
  aiCredits: number;
  lastClaimDate: string;
  claimDailyCredits: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<UserTier>('FREE');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proModalFeature, setProModalFeature] = useState('This');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currency, setCurrencyState] = useState('USD');
  const [aiCredits, setAiCredits] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState('');

  const updateCurrency = (newCurrency: any) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('user_currency', newCurrency);
    
    // Sync to Firestore if logged in
    if (user?.uid && isConfigValid) {
      const profileRef = doc(db, 'profiles', user.uid);
      setDoc(profileRef, { currency: newCurrency }, { merge: true }).catch(e => {
        console.error("Failed to sync currency:", e);
      });
    }
  };

  useEffect(() => {
    // Load currency from localStorage initially
    const savedCurrency = localStorage.getItem('user_currency');
    if (savedCurrency) setCurrencyState(savedCurrency);
    let unsubscribeProfile: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && isConfigValid) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });

        // Listen for profile changes (tier, etc)
        const profileRef = doc(db, 'profiles', firebaseUser.uid);
        
        try {
          // Ensure profile exists
          const profileSnap = await getDoc(profileRef);
          if (!profileSnap.exists()) {
            const today = new Date().toISOString().split('T')[0];
            await setDoc(profileRef, {
              email: firebaseUser.email,
              planTier: 'FREE',
              aiUsageCount: 0,
              aiCredits: 100,
              lastClaimDate: today,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            setAiCredits(100);
            setLastClaimDate(today);
          } else {
            // Hydrate initial usage
            setAiUsageCount(profileSnap.data().aiUsageCount || 0);
            setAiCredits(profileSnap.data().aiCredits ?? 100);
            setLastClaimDate(profileSnap.data().lastClaimDate || '');
          }

          unsubscribeProfile = onSnapshot(profileRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setTier(data.planTier || 'FREE');
              setAiUsageCount(data.aiUsageCount || 0);
              setAiCredits(data.aiCredits ?? 100);
              setLastClaimDate(data.lastClaimDate || '');
              if (data.currency) {
                setCurrencyState(data.currency);
                localStorage.setItem('user_currency', data.currency);
              }
            }
          });
        } catch (error: any) {
          // If Firestore fails (e.g. offline due to bad config), silently fallback
          if (error.message?.includes('offline') || error.message?.includes('permission')) {
            console.warn("Firestore in limited mode (offline/unconfigured)");
          } else {
            console.error("Firestore sync error:", error);
          }
          // Default fallback
          setTier('FREE');
          setAiUsageCount(0);
          setAiCredits(100);
          setLastClaimDate('');
        }
      } else {
        setUser(null);
        setTier('FREE');
        setAiUsageCount(0);
        setAiCredits(0);
        setLastClaimDate('');
        if (unsubscribeProfile) unsubscribeProfile();
      }
      setLoading(false);
      setIsHydrated(true);
    });

    return () => {
      unsubAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [user?.uid]);

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.message.includes('configuration is missing')) {
        toast.error('Firebase Setup Required', {
          description: 'Please configure your Firebase keys in the Settings menu to enable Authentication and Database features.',
          duration: 6000,
        });
      } else {
        toast.error('Login Failed', {
          description: error.message || 'An unexpected error occurred during login.',
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const incrementAiUsage = () => {
    setAiUsageCount(prev => prev + 1);
  };

  const { config } = useSystemConfigs();

  const claimDailyCredits = async () => {
    if (!user?.uid) return;
    const today = new Date().toISOString().split('T')[0];
    if (lastClaimDate === today) {
      toast.error('Already claimed today');
      return;
    }

    if (isConfigValid) {
      try {
        const profileRef = doc(db, 'profiles', user.uid);
        await updateDoc(profileRef, {
          aiCredits: increment(30),
          lastClaimDate: today,
          updatedAt: serverTimestamp()
        });
        toast.success('Successfully claimed 30 daily credits!');
      } catch (error) {
        console.error("Failed to claim credits:", error);
        toast.error('Failed to claim credits');
      }
    } else {
      // Offline fallback
      setAiCredits(prev => prev + 30);
      setLastClaimDate(today);
      toast.success('Successfully claimed 30 daily credits! (Offline mode)');
    }
  };

  const consumeCredit = async (toolIdOrCost: string | number = 1) => {
    let cost = typeof toolIdOrCost === 'number' ? toolIdOrCost : 1;
    if (typeof toolIdOrCost === 'string') {
      try {
        const storedTools = JSON.parse(localStorage.getItem('fk_tools') || '[]');
        const tool = storedTools.find((t: any) => t.id === toolIdOrCost);
        if (tool && tool.aiCreditsPerUse !== undefined) {
          cost = tool.aiCreditsPerUse;
        }
      } catch (e) {}
    }

    if (cost === 0) return true;
    
    if (aiCredits < cost) {
      toast.error(`Not enough credits. Required: ${cost}, Available: ${aiCredits}`);
      return false;
    }
    
    if (user?.uid) {
      if (isConfigValid) {
        try {
          const profileRef = doc(db, 'profiles', user.uid);
          await updateDoc(profileRef, {
            aiCredits: increment(-cost),
            aiUsageCount: increment(1)
          });
          return true;
        } catch (error) {
          console.error("Failed to consume credit:", error);
          return false;
        }
      } else {
        // Offline
        setAiCredits(prev => prev - cost);
        setAiUsageCount(prev => prev + 1);
        return true;
      }
    } else {
      if (aiUsageCount < config.freemiumCreditLimit) {
        setAiUsageCount(prev => prev + 1);
        return true;
      }
    }
    return false;
  };

  const showProModal = (featureName: string = 'This') => {
    setProModalFeature(featureName);
    setIsProModalOpen(true);
  };

  const closeProModal = () => {
    setIsProModalOpen(false);
  };

  const toggleProMode = () => {
    setTier(prev => (prev === 'PRO' ? 'FREE' : 'PRO'));
  };

  const showAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const updateProfile = async (data: { name?: string; email?: string; currency?: string }) => {
    if (!user?.uid) return;

    if (isConfigValid) {
      try {
        const profileRef = doc(db, 'profiles', user.uid);
        await setDoc(profileRef, {
          ...data,
          updatedAt: serverTimestamp()
        }, { merge: true });

        if (data.name) {
          setUser((prev: any) => ({ ...prev, name: data.name }));
        }
        if (data.currency) {
          setCurrencyState(data.currency);
          localStorage.setItem('user_currency', data.currency);
        }
      } catch (error) {
        console.error("Update profile failed:", error);
        throw error;
      }
    } else {
      // Local updates only if Firestore is offline
      if (data.name) setUser((prev: any) => ({ ...prev, name: data.name }));
      if (data.currency) {
        setCurrencyState(data.currency);
        localStorage.setItem('user_currency', data.currency);
      }
    }
  };

  const showLeadCapture = (featureName: string = 'This') => {
    setProModalFeature(featureName);
    setIsLeadCaptureOpen(true);
  };

  const closeLeadCapture = () => {
    setIsLeadCaptureOpen(false);
  };

  const isPro = tier === 'PRO';

  return (
    <UserContext.Provider value={{ 
      tier, 
      setTier, 
      user, 
      loading,
      login, 
      logout, 
      isPro, 
      aiUsageCount, 
      incrementAiUsage,
      consumeCredit,
      showProModal,
      closeProModal,
      isProModalOpen,
      proModalFeature,
      showLeadCapture,
      closeLeadCapture,
      isLeadCaptureOpen,
      toggleProMode,
      showAuthModal,
      closeAuthModal,
      isAuthModalOpen,
      authInitialMode,
      isHydrated,
      currency,
      updateCurrency,
      updateProfile,
      aiCredits,
      lastClaimDate,
      claimDailyCredits
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
