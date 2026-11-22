import React from 'react';
import { QrCode, Smartphone, Landmark, UserCheck, ArrowRight } from 'lucide-react';

export default function QuickActions({ onOpenScanner, onOpenManualPay }) {
  const actions = [
    {
      id: 'scan',
      title: 'Scan Any QR',
      subtitle: 'UPI & BharatQR',
      icon: QrCode,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Camera',
      onClick: onOpenScanner
    },
    {
      id: 'mobile',
      title: 'To Mobile',
      subtitle: 'Phone Number',
      icon: Smartphone,
      color: 'from-blue-600 to-indigo-600',
      onClick: () => onOpenManualPay('mobile')
    },
    {
      id: 'upi',
      title: 'To UPI ID',
      subtitle: 'Any UPI / Bank',
      icon: Landmark,
      color: 'from-indigo-600 to-violet-600',
      onClick: () => onOpenManualPay('upi')
    },
    {
      id: 'self',
      title: 'To Self A/c',
      subtitle: 'Linked Banks',
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-600',
      onClick: () => onOpenManualPay('self')
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Money Transfers & UPI
        </h2>
        <span className="text-[11px] text-cyan-600 font-medium">Zero Fee</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className="flex flex-col items-center group active:scale-95 transition"
            >
              <div className="relative mb-2">
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${act.color} flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                {act.badge && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                    {act.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-800 text-center leading-tight">
                {act.title}
              </span>
              <span className="text-[10px] text-slate-600 text-center hidden sm:block">
                {act.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
