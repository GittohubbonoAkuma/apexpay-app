import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, RotateCcw, Filter, Search, CheckCircle2 } from 'lucide-react';

export default function PassbookModal({ isOpen, onClose, balance, transactions, onSelectTxn, onResetData }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'DEBIT' | 'CREDIT'
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = transactions.filter((t) => {
    if (filter !== 'ALL' && t.type !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title?.toLowerCase().includes(q) ||
        t.subtitle?.toLowerCase().includes(q) ||
        t.refNo?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="bg-fintech-blue text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base tracking-tight">Passbook & Account History</h3>
            <p className="text-xs text-cyan-200">Wallet Balance: ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, UPI ID or Ref No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Type filters */}
          <div className="flex gap-1.5">
            {['ALL', 'DEBIT', 'CREDIT'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filter === f
                    ? 'bg-fintech-blue text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'DEBIT' ? 'Paid / Debited' : 'Received / Added'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No transactions match your search filter.
            </div>
          ) : (
            filtered.map((txn) => {
              const isDebit = txn.type === 'DEBIT';
              const dateStr = new Date(txn.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={txn.id}
                  onClick={() => onSelectTxn(txn)}
                  className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                      isDebit ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {isDebit ? <ArrowUpRight className="w-4 h-4 text-slate-600" /> : <ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {txn.title}
                      </h4>
                      <p className="text-[10px] text-slate-600">
                        {dateStr}
                      </p>
                      {txn.type === 'DEBIT' && (txn.payeeVpa || txn.subtitle?.replace(/^Paid to /, '')) && (
                        <p className="text-[10px] font-mono text-slate-500">
                          {txn.payeeVpa || txn.subtitle.replace(/^Paid to /, '')}
                        </p>
                      )}
                      <p className="text-[10px] font-mono text-slate-600">
                        {txn.refNo}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold ${
                      isDebit ? 'text-slate-900' : 'text-emerald-600'
                    }`}>
                      {isDebit ? '- ' : '+ '}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="text-[9px] text-emerald-600 font-medium">SUCCESS</span>
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Reset Data */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-600 text-[11px]">Academic Ledger Storage</span>
          <button
            onClick={onResetData}
            className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition text-[11px] font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
