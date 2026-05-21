import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, Clock, ArrowRight, Plus, Trash2, Calendar } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  offset: number;
}

export default function TimezoneConverter() {
  const [baseTime, setBaseTime] = useState(new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0'));
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [zones, setZones] = useState<Zone[]>([
    { id: '1', name: 'New York (EST)', offset: -5 },
    { id: '2', name: 'London (GMT)', offset: 0 },
    { id: '3', name: 'Dubai (GST)', offset: 4 },
  ]);

  const addZone = () => {
    const name = prompt('Enter city or timezone name:');
    const offset = prompt('Enter UTC offset (e.g. -5, +3, 5.5):');
    if (name && offset) {
      setZones([...zones, { id: Date.now().toString(), name, offset: parseFloat(offset) }]);
    }
  };

  const removeZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const convertTime = (offset: number) => {
    const [hours, minutes] = baseTime.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours);
    date.setMinutes(minutes);
    
    // Adjust for UTC then for target offset
    const userOffset = new Date().getTimezoneOffset(); // in minutes
    const utcTime = date.getTime() + (userOffset * 60000);
    const targetTime = new Date(utcTime + (offset * 3600000));
    
    return targetTime;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-primary" size={20} /> Base Time
            </h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Local Reference</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reference Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="date" 
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reference Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="time" 
                  value={baseTime}
                  onChange={(e) => setBaseTime(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
            <Globe className="text-primary mt-0.5" size={18} />
            <p className="text-xs text-slate-600 leading-relaxed">
              Set your meeting time or deadline here to see what time it will be for your international clients.
            </p>
          </div>
        </div>

        <button 
          onClick={addZone}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add Timezone
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Converted Times</h4>
        {zones.map((zone) => {
          const converted = convertTime(zone.offset);
          const isNextDay = new Date(converted).getDate() !== new Date(baseDate).getDate();
          
          return (
            <motion.div 
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={zone.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group"
            >
              <div>
                <h5 className="font-bold text-slate-900 mb-1">{zone.name}</h5>
                <p className="text-xs text-slate-400">UTC {zone.offset >= 0 ? '+' : ''}{zone.offset}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-2xl font-black font-display text-primary">
                    {converted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {converted.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    {isNextDay && <span className="ml-1 text-danger"> (+1 Day)</span>}
                  </div>
                </div>
                <button 
                  onClick={() => removeZone(zone.id)}
                  className="p-2 text-slate-200 hover:text-danger rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {zones.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
            <Globe size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 text-sm">Add a timezone to start converting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
