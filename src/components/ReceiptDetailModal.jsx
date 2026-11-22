import React from 'react';
import { X, CheckCircle2, Share2, Download, Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function ReceiptDetailModal({ txn, onClose }) {
  if (!txn) return null;

  const isDebit = txn.type === 'DEBIT';
  const formattedDate = new Date(txn.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Transaction Details
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center border-b border-slate-100">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md ${
            isDebit ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {isDebit ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
          </div>

          <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {isDebit ? '- ' : '+ '}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 mb-0.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Transaction Successful</span>
          </div>

          <p className="text-xs font-medium text-slate-500">
            {txn.title} &bull; {txn.subtitle}
          </p>
        </div>

        {/* Details list */}
        <div className="p-5 space-y-3 text-xs bg-slate-50/50">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono font-semibold text-slate-800">{txn.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">UPI Ref / UTR</span>
            <span className="font-mono font-semibold text-slate-800">{txn.refNo}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Date & Time</span>
            <span className="text-slate-700">{formattedDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Payment Category</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold text-[10px]">
              {txn.category || 'General Payment'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Save / Print</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 bg-fintech-blue hover:bg-[#00225e] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
