import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatabaseService, SystemConfig, MockSystemConfig } from '../services/DatabaseService';

interface SystemConfigContextType {
  config: SystemConfig;
  loading: boolean;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

export function SystemConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(MockSystemConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DatabaseService.getSystemConfig().then(fetchedConfig => {
      setConfig(fetchedConfig);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load system config", err);
      setLoading(false);
    });
  }, []);

  return (
    <SystemConfigContext.Provider value={{ config, loading }}>
        {children}
    </SystemConfigContext.Provider>
  );
}

export function useSystemConfigs() {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error('useSystemConfigs must be used within a SystemConfigProvider');
  }
  return context;
}
