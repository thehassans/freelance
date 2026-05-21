/// <reference types="vite/client" />
export interface User {
  id: string;
  email: string;
  name?: string;
  tier: 'FREE' | 'PRO';
  credits: number;
}

export interface SystemConfig {
  freemiumCreditLimit: number;
  arbitragePlatformFees: number;
  taxBaselinePercentages: {
    US: number; // e.g. self employment tax baseline 0.153
    UK: number; // e.g. generic tax baseline 0.25
    Generic: number;
  };
}

export interface SavedPortal {
  id: string;
  userId: string;
  name: string;
  data: any;
  createdAt: Date;
}

export interface LiveBacklink {
  referringPageTitle: string;
  referringPageUrl: string;
  anchorTextContext: string;
  anchorText: string;
  targetUrl: string;
  domainRating: number;
  type: 'Dofollow' | 'Nofollow';
}

export interface LiveBacklinkReport {
  domain: string;
  domainRating: number;
  urlRating: number;
  totalBacklinks: number;
  dofollowBacklinksPercentage: number;
  referringDomains: number;
  dofollowReferringDomainsPercentage: number;
  backlinks: LiveBacklink[];
}

export const MockSystemConfig: SystemConfig = {
  freemiumCreditLimit: 5,
  arbitragePlatformFees: 2.9, // percentage
  taxBaselinePercentages: {
    US: 15.3,
    UK: 6.0,
    Generic: 25.0,
  }
};

/**
 * API-First Service Layer (Mocked)
 */
export interface AuditReportPayload {
  domain: string;
  cms: string;
  scores: {
    security: { score: number; max: number };
    gdpr: { score: number; max: number };
    seo: { score: number; max: number };
    html: { score: number; max: number };
    performance: { score: number; max: number };
  };
  security: {
    headers: Array<{ name: string; value: string; status: 'secure' | 'warning' | 'danger' }>;
  };
  gdpr: {
    externalResources: Array<{ name: string; withoutConsent: boolean }>;
  };
  seo: {
    title: string;
    metaDescription: string;
    openGraph: Record<string, string>;
  };
  html: {
    tagStatistics: Record<string, number>;
  };
  dns: {
    entries: Array<{ domain: string; type: string; ttl: number; value: string; note?: string }>;
  };
}

export const DatabaseService = {
  /**
   * Fetches the global system configuration
   */
  async getSystemConfig(): Promise<SystemConfig> {
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve(MockSystemConfig), 300));
  },

  fetchLiveSecurityAudit: async (url: string): Promise<AuditReportPayload> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      console.error(e);
      throw new Error('Backend connection failed. Please ensure your API is running.');
    }
  },

  /**
   * Deducts a user credit
   * @param userId The ID of the user
   */
  async deductUserCredit(userId: string): Promise<boolean> {
    if (!userId) throw new Error("userId is required for deductUserCredit");
    // Mock simulation
    return new Promise(resolve => setTimeout(() => resolve(true), 150));
  },

  /**
   * Upgrades a user tier
   * @param userId The ID of the user
   * @param newTier The new tier to upgrade to
   */
  async upgradeUserTier(userId: string, newTier: 'PRO'): Promise<boolean> {
    if (!userId) throw new Error("userId is required for upgradeUserTier");
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  },

  /**
   * Saves a client portal
   * @param userId The ID of the user
   * @param payload The portal details
   */
  async saveClientPortal(userId: string, payload: Omit<SavedPortal, 'id' | 'userId' | 'createdAt'>): Promise<SavedPortal> {
    if (!userId) throw new Error("userId is required for saveClientPortal");
    return new Promise(resolve => setTimeout(() => resolve({
      id: Math.random().toString(36).substring(7),
      userId,
      ...payload,
      createdAt: new Date(),
    }), 400));
  },

  /**
   * Saves a generic user document
   */
  async saveUserDocument<T>(userId: string, documentType: string, payload: T): Promise<boolean> {
    if (!userId) throw new Error("userId is required for saveUserDocument");
    // Mock simulation
    return new Promise(resolve => setTimeout(() => resolve(true), 150));
  },

  /**
   * Logs tool usage for analytics
   */
  async logToolUsage(toolId: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 100));
  },

  /**
   * Fetches real live backlink data (Mocked for testing. Mimics Ahrefs data for dfruit.co)
   */
  async fetchLiveBacklinkData(domain: string): Promise<LiveBacklinkReport> {
    const cleanTargetDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Simulating a 2-3 second API query
    return new Promise(resolve => setTimeout(() => {
      resolve({
        domain: cleanTargetDomain,
        domainRating: 64,
        urlRating: 32,
        totalBacklinks: 12450,
        dofollowBacklinksPercentage: 35,
        referringDomains: 1204,
        dofollowReferringDomainsPercentage: 34,
        backlinks: [
          {
            referringPageTitle: 'The 50 Best Design Agencies in New York',
            referringPageUrl: 'https://designrush.com/agency/new-york',
            anchorTextContext: 'We highly recommend the team at ',
            anchorText: 'DFruit',
            targetUrl: `https://${cleanTargetDomain}/`,
            domainRating: 88,
            type: 'Dofollow'
          },
          {
            referringPageTitle: 'Awwwards - Sites of the Day',
            referringPageUrl: 'https://www.awwwards.com/sites/dfruit-agency',
            anchorTextContext: 'Award-winning interactive design by ',
            anchorText: 'dfruit.co',
            targetUrl: `https://${cleanTargetDomain}/about`,
            domainRating: 91,
            type: 'Dofollow'
          },
          {
            referringPageTitle: 'Top Branding Experts to Follow in 2026',
            referringPageUrl: 'https://clutch.co/agencies/branding',
            anchorTextContext: 'Their unique approach at ',
            anchorText: 'Dfruit Branding',
            targetUrl: `https://${cleanTargetDomain}/services`,
            domainRating: 85,
            type: 'NOFOLLOW' as any,
          },
          {
            referringPageTitle: 'Next.js Showcase - Featured Projects',
            referringPageUrl: 'https://nextjs.org/showcase',
            anchorTextContext: 'Blazing fast frontend performance built by ',
            anchorText: 'DFRUIT',
            targetUrl: `https://${cleanTargetDomain}/`,
            domainRating: 95,
            type: 'Dofollow'
          },
          {
            referringPageTitle: 'How to structure a design system',
            referringPageUrl: 'https://css-tricks.com/design-system-structure/',
            anchorTextContext: 'As seen in the recent case study by ',
            anchorText: 'the Dfruit team',
            targetUrl: `https://${cleanTargetDomain}/blog/design-systems`,
            domainRating: 89,
            type: 'Dofollow'
          },
          {
            referringPageTitle: 'Startup Resources Directory 2026',
            referringPageUrl: 'https://startup-resources.io/directory/agencies',
            anchorTextContext: 'A great partner for MVP design is ',
            anchorText: 'https://dfruit.co',
            targetUrl: `https://${cleanTargetDomain}/`,
            domainRating: 42,
            type: 'Nofollow'
          },
          {
            referringPageTitle: '10 Portfolios with Incredible Typography',
            referringPageUrl: 'https://typewolf.com/portfolios',
            anchorTextContext: 'Notice the beautiful serif pairings on ',
            anchorText: 'DFruit\'s portfolio',
            targetUrl: `https://${cleanTargetDomain}/work`,
            domainRating: 83,
            type: 'Dofollow'
          }
        ]
      });
    }, 2500));
  }
};
