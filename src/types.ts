export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'finance' | 'sales' | 'legal' | 'development' | 'operations' | 'marketing' | 'security' | string[];
  icon: any;
  tier: 'FREE' | 'FREEMIUM' | 'PRO';
  hasAI: boolean;
  component: string;
  outputType?: string;
  persona?: string;
  personas?: string[];
  monthlyViews: number;
  tags?: string[];
  usageCount?: number;
  audience?: string | string[];
}

export type Category = {
  id: string;
  name: string;
  description: string;
};
