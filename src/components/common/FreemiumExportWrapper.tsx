import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { TOOLS } from '../../lib/tools-registry';
import CreditUsageBar from './CreditUsageBar';

interface FreemiumExportWrapperProps {
  toolId: string;
  children: React.ReactNode;
  className?: string;
}

export default function FreemiumExportWrapper({ toolId, children, className = "" }: FreemiumExportWrapperProps) {
  const { isPro } = useUser();
  
  // Find the tool in the registry to check its tier
  const tool = TOOLS.find(t => t.id === toolId);
  const isFreemium = tool?.tier === 'FREEMIUM';

  if (!isFreemium || isPro) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <CreditUsageBar />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
