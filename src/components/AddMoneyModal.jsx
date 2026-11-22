import React, { useState } from 'react';
import { X, PlusCircle, Landmark, ShieldCheck, Check } from 'lucide-react';

export default function AddMoneyModal({ isOpen, onClose, onAddSuccess }) {
  const [amount, setAmount] = useState('1000');
  const presets = [500, 1000, 2000, 5000];

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    onAddSuccess(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-600" />
            <h3 className="font-extrabold text-sm text-slate-800">Add Money to Wallet</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Top-up Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-2xl font-extrabold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-cyan-400 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="flex gap-2 mt-3">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAmount(p.toString())}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  +₹{p}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-fintech-blue">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">From HDFC Bank ••4819</div>
              <div className="text-[10px] text-blue-700 font-medium">Instant sandbox top-up</div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-fintech-blue hover:bg-[#00225e] text-white font-extrabold text-sm rounded-xl shadow-md transition"
          >
            Add ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'} to Wallet
          </button>
        </form>
      </div>
    </div>
  );
}
