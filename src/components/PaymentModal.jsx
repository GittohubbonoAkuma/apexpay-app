import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Wallet, Landmark, ChevronDown, Sparkles } from 'lucide-react';

export default function PaymentModal({ target, walletBalance, onClose, onConfirmPayment }) {
  const [amount, setAmount] = useState(target.amount ? target.amount.toString() : '');
  const [note, setNote] = useState(target.note || '');
  const [selectedSource, setSelectedSource] = useState('wallet'); // 'wallet' | 'bank'
  const [errorMsg, setErrorMsg] = useState('');

  const quickAmounts = [100, 200, 500, 1000];

  const handleAddAmount = (addVal) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + addVal).toString());
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount');
      return;
    }

    if (selectedSource === 'wallet' && numAmount > walletBalance) {
      setErrorMsg(`Insufficient wallet balance (Available: ₹${walletBalance.toFixed(2)})`);
      return;
    }

    onConfirmPayment({
      target,
      amount: numAmount,
      note: note.trim() || 'Payment via ApexPay',
      source: selectedSource === 'wallet' ? 'ApexPay Wallet' : 'HDFC Bank ••4819'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              UPI Sandbox Transfer
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payee Profile Card */}
        <div className="p-5 text-center border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-fintech-blue to-cyan-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-2 shadow-md">
            {target.name ? target.name.charAt(0).toUpperCase() : 'P'}
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
              {target.name}
            </h3>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
          </div>

          <p className="text-xs font-mono text-slate-600">
            {target.vpa}
          </p>

          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Banking Name Verified &bull; NPCI Active
          </span>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Big Amount Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block text-center mb-1">
              Enter Amount
            </label>
            <div className="relative max-w-xs mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-3 text-3xl font-extrabold text-center text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-fintech-cyan focus:bg-white focus:outline-none transition"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium text-center mt-1.5 animate-bounce-short">
                {errorMsg}
              </p>
            )}

            {/* Quick Amount Chips */}
            <div className="flex justify-center gap-2 mt-3">
              {quickAmounts.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => handleAddAmount(q)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition active:scale-95"
                >
                  +₹{q}
                </button>
              ))}
            </div>
          </div>

          {/* Add a Note */}
          <div>
            <input
              type="text"
              placeholder="Add a message or remark (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-400 focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Payment Method / Account Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Pay From
            </span>

            {/* Wallet Option */}
            <label
              onClick={() => setSelectedSource('wallet')}
              className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition ${
                selectedSource === 'wallet'
                  ? 'border-fintech-cyan bg-cyan-50/40 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-fintech-blue">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">ApexPay Wallet</div>
                  <div className="text-[11px] text-slate-600">
                    Available: ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <input
                type="radio"
                name="source"
                checked={selectedSource === 'wallet'}
                onChange={() => setSelectedSource('wallet')}
                className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
              />
            </label>

            {/* Bank Option */}
            <label
              onClick={() => setSelectedSource('bank')}
              className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition ${
                selectedSource === 'bank'
                  ? 'border-fintech-cyan bg-cyan-50/40 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">HDFC Bank A/c ••4819</div>
                  <div className="text-[11px] text-slate-600">Savings Account (Direct UPI)</div>
                </div>
              </div>

              <input
                type="radio"
                name="source"
                checked={selectedSource === 'bank'}
                onChange={() => setSelectedSource('bank')}
                className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
              />
            </label>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-fintech-blue to-[#004dc7] hover:from-[#00225e] hover:to-[#003da1] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-900/20 active:scale-[0.99] transition flex items-center justify-center gap-2 mt-2"
          >
            <span>Pay ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
