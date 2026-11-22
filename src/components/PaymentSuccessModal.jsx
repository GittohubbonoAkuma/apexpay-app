import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Share2, FileText, ArrowRight, ShieldCheck, Sparkles, Home } from 'lucide-react';
import { playSuccessChime } from '../utils/audioChime';

export default function PaymentSuccessModal({ txn, onClose, onViewPassbook }) {
  useEffect(() => {
    // 1. Play audio chime
    playSuccessChime();

    // 2. Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b386', '#00baf2', '#002970', '#ffd700']
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Payment Confirmation',
        text: `Paid ₹${txn.amount} to ${txn.title} via ApexPay (Ref: ${txn.refNo})`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert(`Payment Reference: ${txn.refNo}\nAmount: ₹${txn.amount}\nPaid to: ${txn.title}`);
    }
  };

  const formattedDate = new Date(txn.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] animate-scale-up">
        
        {/* Top Green Hero Banner */}
        <div className="bg-gradient-to-b from-emerald-600 via-emerald-500 to-[#00a876] text-white p-7 text-center relative overflow-hidden">
          {/* Subtle background pulse rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Animated Green Checkmark Circle */}
          <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-900/20 transform transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Check className="w-10 h-10 stroke-[3.5]" />
            </div>
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 bg-white/15 px-3 py-1 rounded-full inline-block mb-2">
              Payment Successful
            </span>
            <div className="text-4xl font-extrabold tracking-tight mb-1">
              ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm font-semibold text-emerald-50">
              Paid to <span className="underline decoration-emerald-300 underline-offset-2">{txn.title}</span>
            </p>
          </div>
        </div>

        {/* Banking Verification Row */}
        <div className="bg-emerald-50 border-y border-emerald-200/60 px-4 py-2 text-center">
          <p className="text-[11px] font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bank Reference ID Verified &bull; NPCI Fast-Settle Switch</span>
          </p>
        </div>

        {/* Receipt Details Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-slate-800 text-xs">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">To Payee</span>
              <span className="font-bold text-slate-900 text-right">{txn.title}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Payee UPI ID</span>
              <span className="font-mono text-slate-700">{txn.subtitle?.replace('Paid to ', '')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Paid From</span>
              <span className="font-bold text-slate-800">{txn.paymentSource || 'ApexPay Wallet'}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium">UPI Ref / UTR</span>
              <span className="font-mono font-semibold text-slate-800">{txn.refNo}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Date & Time</span>
              <span className="text-slate-700">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                COMPLETED
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onClose}
              className="w-full py-3 bg-fintech-blue hover:bg-[#00225e] text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Receipt</span>
              </button>

              <button
                onClick={onViewPassbook}
                className="py-2.5 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-cyan-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View in Passbook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
