export const storage = {
  get: (key: string) => {
    try { 
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item);
    } catch { 
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to set localStorage', e);
    }
  },
  append: (key: string, item: any, maxItems = 500) => {
    const arr = storage.get(key) || [];
    arr.push({ ...item, timestamp: new Date().toISOString() });
    if (arr.length > maxItems) arr.splice(0, arr.length - maxItems);
    storage.set(key, arr);
  }
};

export function trackToolLaunch(toolId: string, toolName: string, toolTier: string) {
  storage.append('fk_events', {
    type: 'tool_launch',
    toolId,
    toolName,
    toolTier,
    date: new Date().toISOString().split('T')[0]
  });
  
  const tools = storage.get('fk_tools') || [];
  const idx = tools.findIndex((t: any) => t.id === toolId);
  if (idx > -1) {
    tools[idx].launchCount = (tools[idx].launchCount || 0) + 1;
    storage.set('fk_tools', tools);
  }
}
