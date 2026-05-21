import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Check, Send, Loader2, AlertCircle, Clock, FileText, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SignaturePad from '../common/SignaturePad';
import UniversalDocumentPreview from '../common/UniversalDocumentPreview';

interface ContractPortalProps {
  shareId: string;
}

export default function ContractPortal({ shareId }: ContractPortalProps) {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const q = query(collection(db, 'contracts'), where('shareId', '==', shareId));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setError("This agreement could not be found or has been removed.");
          setLoading(false);
          return;
        }

        const data = snapshot.docs[0].data();
        setContract({ id: snapshot.docs[0].id, ...data });
        setLoading(false);

        // Silent tracking
        fetch(`/api/contract/${shareId}/viewed`, { method: 'POST' });
        
        // Listen for live updates (e.g. if freelancer signs while client watches)
        const unsub = onSnapshot(snapshot.docs[0].ref, (doc) => {
          setContract({ id: doc.id, ...doc.data() });
        });
        return () => unsub();
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load agreement. Please check your connection.");
        setLoading(false);
      }
    };

    fetchContract();
  }, [shareId]);

  const handleSign = async (signature: string) => {
    setSigning(true);
    try {
      const res = await fetch('/api/contract/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId, clientSign: signature })
      });
      
      if (!res.ok) throw new Error("Failed to process signature");
      
      setSigned(true);
    } catch (err) {
      alert("Error processing your signature. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Agreement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-xl">
           <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
           </div>
           <h2 className="text-xl font-bold text-slate-900 mb-2">Agreement Not Found</h2>
           <p className="text-slate-500 text-sm mb-8">{error}</p>
           <button onClick={() => window.location.href = '/'} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Back to FreelancerKit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-primary/20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Document Column */}
        <div className="space-y-6">
           <div className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-2xl">
              <UniversalDocumentPreview
                documentName={`SignedAgreement_${contract.clientName}`}
                primaryColor="#0f172a"
              >
                <div className="flex flex-col font-sans text-slate-800 p-8 h-full">
                   <div className="flex justify-between items-start mb-12 border-b pb-8 border-slate-100">
                      <div>
                        <div className="text-xl font-black tracking-tighter text-slate-900 mb-1">
                          {contract.contractType?.toUpperCase()}
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none font-bold">
                          {contract.status === 'SIGNED' ? 'EXECUTED AGREEMENT' : 'PENDING ACCEPTANCE'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Created on</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(contract.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>

                   <div className="prose prose-slate max-w-none flex-grow">
                      {contract.status === 'SIGNED' && (
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 mb-8 not-prose">
                           <ShieldCheck size={16} className="text-green-600" />
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Active Agreement Seal</span>
                              <span className="text-[9px] font-mono text-slate-500">AUTH-{contract.shareId.toUpperCase().substring(0, 12)} · {new Date(contract.signedAt).toUTCString()}</span>
                           </div>
                        </div>
                      )}
                      <ReactMarkdown>{contract.content}</ReactMarkdown>
                   </div>

                   <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-2 gap-12">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Freelancer Signature</p>
                         <div className="border-b border-slate-200 pb-2 mb-2 italic text-2xl text-slate-900" style={{ fontFamily: 'var(--font-cursive, cursive)' }}>
                           {contract.freelancerSign}
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold">{new Date(contract.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client Acceptance</p>
                         <div className="border-b border-slate-200 pb-2 mb-2 h-16 flex items-end">
                           {contract.clientSign ? (
                             <img src={contract.clientSign} alt="Client Signature" className="h-12 object-contain" />
                           ) : (
                             <div className="w-full h-full bg-slate-50/50 rounded-lg border border-dashed border-slate-200 flex items-center justify-center">
                                <span className="text-[8px] text-slate-300 uppercase font-black">Waiting for Client</span>
                             </div>
                           )}
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold">
                            {contract.signedAt ? new Date(contract.signedAt).toLocaleDateString() : 'Date'}
                         </p>
                      </div>
                   </div>
                </div>
              </UniversalDocumentPreview>
           </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
           <div className="sticky top-8 space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                 
                 <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                       <Clock size={12} className="text-primary" /> Pending Action
                    </div>
                    
                    <h3 className="text-2xl font-bold">Review & Sign</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                       Please carefully review the proposed agreement terms on the left. If they meet your expectations, provide your digital signature below.
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                       <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-500 uppercase">Provider</span>
                          <span>{contract.freelancerName}</span>
                       </div>
                       <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-500 uppercase">Agreement</span>
                          <span>{contract.contractType}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {contract.status === 'SIGNED' || signed ? (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center space-y-4 shadow-xl">
                   <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                      <Check size={32} />
                   </div>
                   <h4 className="text-lg font-bold text-slate-900">Document Executed</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">
                      A copy of this signed agreement has been sent to your email. You can also download the PDF directly using the control on the document.
                   </p>
                   <div className="pt-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                         <Globe size={14} className="text-slate-400" />
                         <span className="text-[10px] font-mono text-slate-500 truncate">IP: Captured & Verified</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                   <SignaturePad 
                     onSave={handleSign}
                     title="Legal Representative Signature"
                     primaryColor="#0f172a"
                   />
                   <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                      <Lock size={16} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                         FreelancerKit uses secure encryption and IP logging to ensure your agreement is legally binding under the ESIGN Act.
                      </p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
