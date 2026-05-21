import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Trash2, Check, PenTool, Eraser, MousePointer2 } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onClear?: () => void;
  title?: string;
  primaryColor?: string;
}

export default function SignaturePad({ onSave, onClear, title = "Sign Document", primaryColor = "#0f4c75" }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
    if (onClear) onClear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    // Use getCanvas instead of getTrimmedCanvas to avoid the broken trim-canvas dependency in Vite
    const canvas = sigCanvas.current?.getCanvas();
    const dataUrl = canvas?.toDataURL('image/png');
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={clear}
            className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
            title="Clear signature"
          >
            <Eraser size={16} />
          </button>
        </div>
      </div>
      
      <div className="relative group bg-white border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden min-h-[200px]">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <PenTool size={64} className="text-slate-400" />
        </div>
        
        <SignatureCanvas 
          ref={sigCanvas}
          penColor="#1e293b"
          canvasProps={{
            className: "signature-canvas w-full h-[200px] cursor-crosshair",
            style: { width: '100%', height: '200px' }
          }}
          onBegin={() => setIsEmpty(false)}
        />
        
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <MousePointer2 size={24} className="text-slate-300 animate-bounce" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sign Here</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={save}
        disabled={isEmpty}
        className={`w-full py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${isEmpty ? 'bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed' : 'text-white shadow-lg active:scale-95'}`}
        style={{ backgroundColor: isEmpty ? undefined : primaryColor }}
      >
        <Check size={18} /> Confirm Digital Signature
      </button>
      
      <p className="text-[10px] text-center text-slate-400 italic">
        By signing, you agree this is a legally binding electronic signature.
      </p>
    </div>
  );
}
