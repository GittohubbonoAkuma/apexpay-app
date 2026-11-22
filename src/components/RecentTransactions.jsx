import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Store, User, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function RecentTransactions({ transactions, onViewAll, onSelectTxn }) {
  const displayList = transactions.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Recent Transactions
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-fintech-cyan hover:text-blue-700 flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {displayList.map((txn) => {
          const isDebit = txn.type === 'DEBIT';
          const dateStr = new Date(txn.date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={txn.id}
              onClick={() => onSelectTxn(txn)}
              className="py-3 flex items-center justify-between hover:bg-slate-50/80 -mx-2 px-2 rounded-xl cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  isDebit ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {isDebit ? <ArrowUpRight className="w-5 h-5 text-slate-600" /> : <ArrowDownLeft className="w-5 h-5 text-emerald-600" />}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                    {txn.title}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {dateStr} &bull; <span className="text-slate-600">{txn.subtitle}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-sm font-bold ${
                  isDebit ? 'text-slate-900' : 'text-emerald-600'
                }`}>
                  {isDebit ? '- ' : '+ '}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[10px] text-emerald-600 font-medium">Successful</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
