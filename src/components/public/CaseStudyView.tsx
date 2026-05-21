import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, Target, Trophy, Sparkles, Loader2, Home, AlertCircle } from 'lucide-react';

import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface CaseStudy {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  primaryColor: string;
}

export default function CaseStudyView({ id: propId }: { id?: string | null }) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [study, setStudy] = useState<CaseStudy | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No case study ID provided.");
      setLoading(false);
      return;
    }

    const fetchStudy = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'caseStudies', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setStudy(docSnap.data() as CaseStudy);
        } else {
          setError("Case study not found.");
        }
      } catch (err) {
        console.error("Firestore error:", err);
        setError("Failed to load case study. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Loading Success Story...</p>
        </div>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-xl">
          <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Oops!</h2>
          <p className="text-slate-500 text-sm mb-8">{error || "We couldn't find that case study."}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
            <Home size={18} /> Back to FreelancerKit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      {/* Header Banner */}
      <div className="h-64 sm:h-80 relative overflow-hidden" style={{ backgroundColor: study.primaryColor }}>
        <div className="absolute inset-0 opacity-10">
          <FileText size={400} className="absolute -right-20 -bottom-20 rotate-12" />
        </div>
        <div className="max-w-4xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">
            Success Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] max-w-3xl">
            {study.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:gap-20">
          {/* Main Content */}
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${study.primaryColor}15`, color: study.primaryColor }}>
                  <Target size={20} />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">01. Situation</h2>
              </div>
              <p className="text-slate-700 text-lg sm:text-xl leading-relaxed font-medium">
                {study.situation}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${study.primaryColor}15`, color: study.primaryColor }}>
                  <FileText size={20} />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">02. Task</h2>
              </div>
              <p className="text-slate-700 text-lg sm:text-xl leading-relaxed font-medium">
                {study.task}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${study.primaryColor}15`, color: study.primaryColor }}>
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">03. Action</h2>
              </div>
              <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-700 text-lg leading-relaxed">
                  {study.action}
                </p>
              </div>
            </section>

            <section className="p-10 sm:p-14 rounded-[3rem] relative overflow-hidden" style={{ backgroundColor: study.primaryColor }}>
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Trophy size={120} />
              </div>
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Trophy size={20} className="text-white" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/60">04. The Result</h2>
                </div>
                <p className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-4">
                  {study.result}
                </p>
                <div className="w-20 h-1 bg-white/30 rounded-full" />
              </div>
            </section>
          </div>

          {/* Footer Branding */}
          <div className="pt-20 border-t border-slate-200 text-center">
            <Link to="/" className="group inline-flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100">
               <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">F</div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document generated safely with FreelancerKit.io</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
