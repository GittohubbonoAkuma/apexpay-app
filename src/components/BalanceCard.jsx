import React, { useState } from 'react';
import { Eye, EyeOff, PlusCircle, History, Landmark, Copy, Check, Edit3, CheckCircle2 } from 'lucide-react';

export default function BalanceCard({ balance, onUpdateBalance, onOpenAddMoney, onOpenPassbook }) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customBalanceInput, setCustomBalanceInput] = useState(balance.toString());
  const upiId = 'student.dev@apexpay';

  const copyUpiId = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCustomBalance = (e) => {
    e.preventDefault();
    const parsed = parseFloat(customBalanceInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBalance(parsed);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fintech-blue via-[#00388d] to-[#005cd6] text-white p-5 shadow-xl shadow-blue-900/15 border border-blue-400/20">
      {/* Decorative background glows */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-600/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Label & UPI Tag */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-cyan-200">Wallet Balance</span>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="text-cyan-200 hover:text-white transition p-0.5"
            title={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <button 
          onClick={copyUpiId}
          className="flex items-center gap-1.5 text-[11px] bg-white/10 hover:bg-white/20 active:scale-95 transition px-2.5 py-1 rounded-full border border-white/15 text-cyan-100"
          title="Click to copy UPI ID"
        >
          <span>UPI: {upiId}</span>
          {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 opacity-70" />}
        </button>
      </div>

      {/* Middle row: Big Amount & Inline Editor */}
      <div className="mb-5 relative z-10">
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-medium text-cyan-200">₹</span>
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {showBalance ? balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '••••••'}
              </span>
            </div>

            {/* Quick Edit Balance Button */}
            <button
              onClick={() => {
                setCustomBalanceInput(balance.toString());
                setIsEditing(true);
              }}
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 active:scale-95 text-cyan-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition border border-white/20"
              title="Change Balance"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        ) : (
          /* Inline Edit Form */
          <form onSubmit={handleSaveCustomBalance} className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
              <input
                type="number"
                step="any"
                min="0"
                value={customBalanceInput}
                onChange={(e) => setCustomBalanceInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white text-slate-900 rounded-xl font-bold text-lg focus:outline-none shadow-inner"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition"
            >
              Cancel
            </button>
          </form>
        )}

        <p className="text-[11px] text-cyan-200/80 mt-1">
          Real-time double-entry ledger &bull; Tap Edit to set any custom balance
        </p>
      </div>

      {/* Bottom row: Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/15 relative z-10">
        <button
          onClick={onOpenAddMoney}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-white text-fintech-blue font-semibold text-xs rounded-xl shadow-md hover:bg-cyan-50 active:scale-[0.98] transition"
        >
          <PlusCircle className="w-4 h-4 text-fintech-cyan" />
          <span>Add Money</span>
        </button>

        <button
          onClick={onOpenPassbook}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-white/15 backdrop-blur-sm text-white font-semibold text-xs rounded-xl hover:bg-white/25 active:scale-[0.98] transition border border-white/20"
        >
          <History className="w-4 h-4 text-cyan-300" />
          <span>Passbook / Ledger</span>
        </button>
      </div>
    </div>
  );
}
