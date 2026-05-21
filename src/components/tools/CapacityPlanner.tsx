import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plus, Trash2, Calendar, LayoutGrid, Clock, UserPlus, Zap, 
  AlertCircle, BarChart3, ChevronRight, DollarSign, FolderKanban, 
  ChevronDown, ChevronUp, Loader2, FileDown, Save, Check, Sparkles, X,
  Search, Filter, Sliders, Play, TrendingUp, HelpCircle
} from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import { pdf } from '@react-pdf/renderer';
import CapacityPlannerPDF from './CapacityPlannerPDF';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import { toast } from 'sonner';
import CapacityPlannerSEO from './CapacityPlannerSEO';

interface Member {
  id: string;
  name: string;
  role: string;
  capacityHours: number;
  assignedHours: number;
  timeOffHours: number;
  billableHours: number;
  costRate: number;
  billRate: number;
}

interface SavedRoster {
  id: string;
  name: string;
  members: Member[];
  timestamp: number;
}

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 
  'UI/UX Designer', 'Graphic Designer', 'Project Manager', 
  'Product Manager', 'SEO Specialist', 'Content Writer', 
  'Data Analyst', 'QA Tester', 'Account Manager', 'DevOps Engineer'
];

export default function CapacityPlanner() {
  const { user, isPro } = useUser();
  const { executeAction } = usePremiumAction();
  
  // Basic State
  const [timeHorizon, setTimeHorizon] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [members, setMembers] = useState<Member[]>([]);
  const [rosterName, setRosterName] = useState('New Roster');
  const [savedRosters, setSavedRosters] = useState<SavedRoster[]>([]);
  const [loadedRosterId, setLoadedRosterId] = useState<string | null>(null);
  
  // Advanced Features State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [globalBuffer, setGlobalBuffer] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Scenario Forecasting
  const [scenarioMode, setScenarioMode] = useState(false);
  const [workloadMultiplier, setWorkloadMultiplier] = useState(0); // -50 to +100

  const [isMitigating, setIsMitigating] = useState(false);
  const [mitigationReport, setMitigationReport] = useState<{ 
    advice: string; 
    level: 'warning' | 'info';
    action?: { fromId: string; toId: string; hours: number }
  } | null>(null);
  const [exporting, setExporting] = useState(false);

  // Load Saved Rosters and Active Roster
  useEffect(() => {
    const rosters = localStorage.getItem('cp_saved_rosters_v3');
    if (rosters) {
      try {
        setSavedRosters(JSON.parse(rosters));
      } catch (e) {
        console.error("Failed to load saved rosters", e);
      }
    }

    const activeRoster = localStorage.getItem('cp_active_roster_v3');
    if (activeRoster) {
      try {
        const parsed = JSON.parse(activeRoster);
        setMembers(parsed.members || []);
        setRosterName(parsed.name || 'Current Roster');
      } catch (e) {
        console.error("Failed to load active roster", e);
      }
    } else {
      setMembers([
        { id: '1', name: 'Yousaf', role: 'Frontend', capacityHours: 40, assignedHours: 35, timeOffHours: 0, billableHours: 30, costRate: 45, billRate: 150 },
        { id: '2', name: 'Sarim', role: 'Design', capacityHours: 40, assignedHours: 20, timeOffHours: 4, billableHours: 15, costRate: 40, billRate: 120 },
        { id: '3', name: 'Zain', role: 'QA', capacityHours: 40, assignedHours: 45, timeOffHours: 0, billableHours: 40, costRate: 25, billRate: 80 },
      ]);
    }
  }, []);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('cp_active_roster_v3', JSON.stringify({ name: rosterName, members }));
  }, [members, rosterName]);

  useEffect(() => {
    localStorage.setItem('cp_saved_rosters_v3', JSON.stringify(savedRosters));
  }, [savedRosters]);

  const saveRoster = () => {
    const newRoster: SavedRoster = {
      id: Date.now().toString(),
      name: rosterName || `Roster ${new Date().toLocaleDateString()}`,
      members,
      timestamp: Date.now()
    };
    
    setSavedRosters(prev => {
      const filtered = prev.filter(r => r.name !== newRoster.name);
      return [newRoster, ...filtered].slice(0, 15);
    });
    
    setLoadedRosterId(newRoster.id);
    toast.success('Roster saved to local archives');
  };

  const updateRoster = () => {
    if (!loadedRosterId) {
      saveRoster();
      return;
    }

    setSavedRosters(prev => prev.map(r => 
      r.id === loadedRosterId 
        ? { ...r, name: rosterName, members, timestamp: Date.now() } 
        : r
    ));
    toast.success('Saved archive updated');
  };

  const deleteRoster = () => {
    if (!loadedRosterId) return;
    
    setSavedRosters(prev => prev.filter(r => r.id !== loadedRosterId));
    setLoadedRosterId(null);
    setMembers([]);
    setRosterName('New Roster');
    toast.error('Roster deleted from archives');
  };

  const resetRoster = () => {
    setMembers([]);
    setRosterName('New Roster');
    setLoadedRosterId(null);
    toast.info('Planner reset to defaults');
  };

  const loadRoster = (id: string) => {
    const found = savedRosters.find(r => r.id === id);
    if (found) {
      setMembers(found.members);
      setRosterName(found.name);
      setLoadedRosterId(found.id);
      toast.success(`Loaded: ${found.name}`);
    }
  };

  const stats = useMemo(() => {
    const multiplier = timeHorizon === 'Monthly' ? 4 : 1;
    const scenarioFactor = scenarioMode ? (1 + workloadMultiplier / 100) : 1;
    const bufferFactor = 1 + globalBuffer / 100;
    
    const totalAvail = members.reduce((sum, m) => sum + (m.capacityHours - m.timeOffHours), 0) * multiplier;
    const rawAssigned = members.reduce((sum, m) => sum + m.assignedHours, 0) * multiplier;
    const totalAssigned = rawAssigned * scenarioFactor * bufferFactor;
    
    const totalBillable = members.reduce((sum, m) => sum + m.billableHours, 0) * multiplier * scenarioFactor;
    
    const utilization = totalAvail > 0 ? Math.round((totalAssigned / totalAvail) * 100) : 0;
    const billableUtil = totalAvail > 0 ? Math.round((totalBillable / totalAvail) * 100) : 0;
    const overbookedCount = members.filter(m => {
      const netCap = m.capacityHours - m.timeOffHours;
      return m.assignedHours > netCap;
    }).length;
    
    const projectedRevenue = totalBillable * members.reduce((avg, m) => avg + m.billRate, 0) / (members.length || 1);
    const totalCost = totalAssigned * members.reduce((avg, m) => avg + m.costRate, 0) / (members.length || 1);
    
    const grossProfit = projectedRevenue - totalCost;
    const margin = projectedRevenue > 0 ? Math.round((grossProfit / projectedRevenue) * 100) : 0;

    return { 
      totalAvail, 
      totalAssigned, 
      utilization, 
      billableUtil,
      overbookedCount,
      projectedRevenue, 
      totalCost, 
      grossProfit, 
      margin 
    };
  }, [members, timeHorizon, scenarioMode, workloadMultiplier, globalBuffer]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           m.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const handleExportPDF = async () => {
    if (members.length === 0) return;
    executeAction(async () => {
      setExporting(true);
      try {
        const blob = await pdf(<CapacityPlannerPDF members={members} stats={stats as any} timeHorizon={timeHorizon} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `V3_PROFIT_Capacity_Report.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error("PDF Fail", e);
        toast.error("Export failed");
      } finally {
        setExporting(false);
      }
    });
  };

  const addMember = () => {
    setMembers([...members, { 
      id: Date.now().toString(), 
      name: 'New Consultant', 
      role: 'Frontend',
      capacityHours: 40, 
      assignedHours: 0,
      timeOffHours: 0,
      billableHours: 0,
      costRate: 40,
      billRate: 120
    }]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: keyof Member, value: any) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const getHeatmapColor = (percentage: number) => {
    if (percentage < 80) return 'bg-emerald-500';
    if (percentage <= 100) return 'bg-amber-500';
    return 'bg-rose-600 text-white font-bold';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Users size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-100 flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Enterprise
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Freemium Capacity Planner Resource Management <span className="text-indigo-600">v3.0 PROFIT+</span>
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              {(['Weekly', 'Monthly'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setTimeHorizon(view)}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    timeHorizon === view 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <button 
              onClick={handleExportPDF}
              disabled={exporting}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
              Export Report
            </button>
          </div>
        </header>

        {/* Main Layout Container */}
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto items-start">
          
          {/* Left Panel: Settings & Control */}
          <aside className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6 sticky top-8">
            
            {/* Roster Management Block */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FolderKanban size={18} className="text-indigo-600" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Roster Management</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Roster Name</label>
                  <input 
                    type="text"
                    value={rosterName}
                    onChange={(e) => setRosterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Saved Archives</label>
                  <select 
                    value={loadedRosterId || ''}
                    onChange={(e) => loadRoster(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                  >
                    <option value="">Select a roster...</option>
                    {savedRosters.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={loadedRosterId ? updateRoster : saveRoster}
                    className="py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    <Save size={14} /> {loadedRosterId ? 'Update' : 'Save'}
                  </button>
                  <button 
                    onClick={deleteRoster}
                    disabled={!loadedRosterId}
                    className="py-2.5 bg-white text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-50 transition-all disabled:opacity-30"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>

                <button 
                  onClick={resetRoster}
                  className="w-full py-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                >
                  <Plus size={14} /> Create New / Reset
                </button>
              </div>
            </div>

            {/* Timeline & Buffer Block */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-indigo-600" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Project Window</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Start</label>
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">End</label>
                    <input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Buffer (%)</label>
                    <span className="text-xs font-black text-indigo-600">{globalBuffer}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="50"
                    value={globalBuffer}
                    onChange={(e) => setGlobalBuffer(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Scenario Forecasting Block */}
            <div className="bg-[#0B1120] p-6 rounded-2xl shadow-xl text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-400" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Scenario Mode</h3>
                  </div>
                  <button 
                    onClick={() => setScenarioMode(!scenarioMode)}
                    className={`w-10 h-5 rounded-full transition-all relative ${scenarioMode ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${scenarioMode ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                
                <AnimatePresence>
                  {scenarioMode && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black tracking-widest">
                        Simulating scope creep or workload shifts...
                      </p>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Adjust Workload</label>
                          <span className={`text-xs font-black ${workloadMultiplier > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {workloadMultiplier > 0 ? '+' : ''}{workloadMultiplier}%
                          </span>
                        </div>
                        <input 
                          type="range"
                          min="-50"
                          max="100"
                          value={workloadMultiplier}
                          onChange={(e) => setWorkloadMultiplier(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>

          {/* Right Panel: Dashboard/Roster */}
          <main className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
            
            {/* Real-time Intel Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Net Capacity', value: `${stats.totalAvail}h`, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Required hours', value: `${Math.round(stats.totalAssigned)}h`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Projected rev', value: `$${stats.projectedRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Gross Margin', value: `${stats.margin}%`, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                  <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                    <stat.icon size={16} />
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Roster Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-grow w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search consultants or roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-[435.947px] bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex-grow sm:flex-none relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full lg:w-[160.732px] ml-0 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-100 outline-none appearance-none"
                  >
                    <option value="All">All Roles</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button 
                  onClick={addMember}
                  className="w-full lg:w-[220px] px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shrink-0"
                >
                  <UserPlus size={16} /> <span className="hidden sm:inline">Add Consultant</span>
                </button>
              </div>
            </div>

            {/* Resource Roster */}
            <div className="space-y-4">
              {filteredMembers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                    <Users size={32} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">No consultants matching criteria</h4>
                  <p className="text-xs text-slate-400 mt-2">Adjust your filters or add a new consultant to the roster.</p>
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const netCap = member.capacityHours - member.timeOffHours;
                  const scenarioFactor = scenarioMode ? (1 + workloadMultiplier / 100) : 1;
                  const currentAssigned = member.assignedHours * scenarioFactor;
                  const currentBillable = member.billableHours * scenarioFactor;
                  
                  const utilPercent = netCap > 0 ? Math.round((currentAssigned / netCap) * 100) : 0;
                  const billableUtil = netCap > 0 ? Math.round((currentBillable / netCap) * 100) : 0;

                  return (
                    <motion.div 
                      key={member.id}
                      layout
                      className="bg-white rounded-2xl border border-slate-200 p-6 transition-all hover:border-indigo-200 group"
                    >
                      <div className="flex flex-col xl:flex-row gap-6">
                        {/* Member Details */}
                        <div className="xl:w-1/3 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-grow">
                              <input 
                                type="text"
                                value={member.name}
                                onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                                className="w-full text-lg font-black text-slate-900 border-none p-0 focus:ring-0 outline-none placeholder:text-slate-300"
                                placeholder="Consultant Name"
                              />
                              <select 
                                value={member.role}
                                onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                                className="block mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-transparent border-none p-0 focus:ring-0 outline-none appearance-none"
                              >
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </div>
                            <button 
                              onClick={() => removeMember(member.id)}
                              className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Dual Metric Heatmap */}
                          <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Utilization %</span>
                                <span className={`text-xs font-black ${utilPercent > 100 ? 'text-rose-600' : 'text-slate-900'}`}>{utilPercent}%</span>
                              </div>
                              <div className="h-6 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                                <motion.div 
                                  className={`absolute left-0 top-0 h-full transition-all ${getHeatmapColor(utilPercent)}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, utilPercent)}%` }}
                                />
                                <span className="relative z-10 text-[9px] font-black uppercase text-center px-2">
                                  {utilPercent > 100 ? 'Critical Redline' : ''}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Billable Utilization</span>
                                <span className="text-xs font-black text-emerald-600">{billableUtil}%</span>
                              </div>
                              <div className="h-4 bg-slate-100 rounded-lg overflow-hidden">
                                <motion.div 
                                  className="h-full bg-indigo-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, billableUtil)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Member Controls */}
                        <div className="xl:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Cap (h)</label>
                            <input 
                              type="number"
                              value={member.capacityHours || ''}
                              onChange={(e) => updateMember(member.id, 'capacityHours', e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Assigned (h)</label>
                            <input 
                              type="number"
                              value={member.assignedHours || ''}
                              onChange={(e) => updateMember(member.id, 'assignedHours', e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Time-off (h)</label>
                            <input 
                              type="number"
                              value={member.timeOffHours || ''}
                              onChange={(e) => updateMember(member.id, 'timeOffHours', e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-rose-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-2">
                               <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Billable hours</label>
                               <input 
                                 type="checkbox"
                                 checked={member.billableHours === member.assignedHours && member.assignedHours > 0}
                                 onChange={(e) => updateMember(member.id, 'billableHours', e.target.checked ? member.assignedHours : 0)}
                                 className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3 w-3"
                               />
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                value={member.billableHours || ''}
                                onChange={(e) => updateMember(member.id, 'billableHours', e.target.value === '' ? 0 : Math.min(member.assignedHours, Math.max(0, Number(e.target.value))))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-emerald-600"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Cost Rate ($)</label>
                            <input 
                              type="number"
                              value={member.costRate || ''}
                              onChange={(e) => updateMember(member.id, 'costRate', e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Bill Rate ($)</label>
                            <input 
                              type="number"
                              value={member.billRate || ''}
                              onChange={(e) => updateMember(member.id, 'billRate', e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black"
                            />
                          </div>
                          <div className="col-span-2 flex items-end justify-end">
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Consultant Value</p>
                               <p className="text-xl font-black text-slate-900">${(currentBillable * member.billRate).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </main>
        </div>

        {/* SEO & FAQ Footer Section */}
        <CapacityPlannerSEO />
      </div>
    </div>
  );
}

