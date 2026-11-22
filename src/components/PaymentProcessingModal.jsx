import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export default function PaymentProcessingModal({ paymentData, onFinished }) {
  const [step, setStep] = useState(0);

  const steps = [
    'Connecting to NPCI Payments Switch...',
    'Authorizing Secure Sandbox Ledger...',
    'Confirming with Payee Bank...'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => {
      onFinished();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        
        {/* Animated Radar Pulse */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full border-2 border-cyan-400/30 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-fintech-blue to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Lock className="w-7 h-7" />
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          Processing Payment
        </h3>
        
        <div className="text-2xl font-black text-fintech-blue mb-4">
          ₹{paymentData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
          <div 
            className="bg-cyan-500 h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 font-medium h-5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
          <span>{steps[step]}</span>
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>End-to-End 256-bit Encrypted</span>
        </div>
      </div>
    </div>
  );
}
