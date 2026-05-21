import React, { useEffect } from 'react';
import { useAdminToasts } from './useAdminToasts';
import DashboardView from './views/DashboardView';
import ToolsView from './views/ToolsView';
import { FlagsView, AnnouncementsView, SeoOverridesView, PlanConfigView } from './views/MiscViews';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import BlogsView from './views/BlogsView';
import UsersView from './views/UsersView';
import SubscriptionsView from './views/SubscriptionsView';
import { DEFAULT_TOOLS, DEFAULT_USERS, DEFAULT_BLOGS, DEFAULT_SUBSCRIPTIONS, DEFAULT_FLAGS, DEFAULT_PLANS, DEFAULT_AI_USAGE, generateMockEvents, syncLaunchCounts } from '../../lib/adminSeedData';

export default function AdminPanel({ view, setView, onExit }: { view: string, setView: (v: string) => void, onExit: () => void }) {
  const { showToast, ToastContainer } = useAdminToasts();

  useEffect(() => {
    // Load tools from localStorage, seed defaults if empty
    const stored = localStorage.getItem('fk_tools');
    let toolsData = stored ? JSON.parse(stored) : null;
    
    if (!toolsData || toolsData.length === 0) {
      localStorage.setItem('fk_tools', JSON.stringify(DEFAULT_TOOLS));
      toolsData = DEFAULT_TOOLS;
    }

    // Load events and sync counts
    const storedEvents = localStorage.getItem('fk_events');
    const events = storedEvents ? JSON.parse(storedEvents) : generateMockEvents(toolsData);
    
    if (!storedEvents) {
      toolsData = syncLaunchCounts(toolsData, events);
      localStorage.setItem('fk_tools', JSON.stringify(toolsData));
    }

    if (!localStorage.getItem('fk_users')) localStorage.setItem('fk_users', JSON.stringify(DEFAULT_USERS));
    if (!localStorage.getItem('fk_flags')) localStorage.setItem('fk_flags', JSON.stringify(DEFAULT_FLAGS));
    if (!localStorage.getItem('fk_blogs')) localStorage.setItem('fk_blogs', JSON.stringify(DEFAULT_BLOGS));
    if (!localStorage.getItem('fk_subscriptions')) localStorage.setItem('fk_subscriptions', JSON.stringify(DEFAULT_SUBSCRIPTIONS));
    if (!localStorage.getItem('fk_plans')) localStorage.setItem('fk_plans', JSON.stringify(DEFAULT_PLANS));
    if (!localStorage.getItem('fk_ai_usage')) localStorage.setItem('fk_ai_usage', JSON.stringify(DEFAULT_AI_USAGE));
  }, []);

  const menu = [
    { section: 'OVERVIEW', items: [{ id: 'dashboard', label: 'Dashboard' }, { id: 'analytics', label: 'Analytics' }] },
    { section: 'TOOLS', items: [{ id: 'tools', label: 'All Tools' }, { id: 'seo', label: 'SEO Overrides' }] },
    { section: 'USERS', items: [{ id: 'users', label: 'All Users' }] },
    { section: 'CONTENT', items: [{ id: 'blogs', label: 'Blog Posts' }, { id: 'sops', label: 'SOPs & Guides' }, { id: 'announcements', label: 'Announcements' }] },
    { section: 'MONETIZATION', items: [{ id: 'subscriptions', label: 'Subscriptions' }] },
    { section: 'PLATFORM', items: [{ id: 'flags', label: 'Feature Flags' }, { id: 'plans', label: 'Plan Config' }, { id: 'settings', label: 'Settings' }] }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B0C14] text-[#E8EAF0] flex flex-col font-sans overflow-hidden">
      {/* TopBar */}
      <div className="h-16 border-b border-[#252E4A] bg-[#13192B] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-black text-[#6EE7B7] text-xl tracking-tighter">FK ADMIN</div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="text-[#6B7280] hover:text-[#E8EAF0] text-sm font-medium transition-colors">
            ← Exit to Site
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#252E4A] bg-[#13192B] p-4 flex flex-col gap-6 shrink-0 overflow-y-auto">
          {menu.map((group, i) => (
            <div key={i}>
              <div className="text-[10px] font-bold text-[#6B7280] mb-2 tracking-widest">{group.section}</div>
              <div className="flex flex-col gap-1">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      view === item.id ? 'bg-[#1C2340] text-[#6EE7B7]' : 'text-[#E8EAF0] hover:bg-[#1C2340]/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0B0C14] overflow-y-auto p-8">
          {view === 'dashboard' && <DashboardView />}
          {view === 'tools' && <ToolsView showToast={showToast} />}
          {view === 'seo' && <SeoOverridesView showToast={showToast} />}
          {view === 'flags' && <FlagsView showToast={showToast} />}
          {view === 'announcements' && <AnnouncementsView showToast={showToast} />}
          {view === 'plans' && <PlanConfigView showToast={showToast} />}
          {view === 'analytics' && <AnalyticsView />}
          {view === 'settings' && <SettingsView showToast={showToast} />}
          {view === 'blogs' && <BlogsView showToast={showToast} typeFilter="blogs" />}
          {view === 'sops' && <BlogsView showToast={showToast} typeFilter="sops" />}
          {view === 'users' && <UsersView showToast={showToast} />}
          {view === 'subscriptions' && <SubscriptionsView showToast={showToast} />}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
