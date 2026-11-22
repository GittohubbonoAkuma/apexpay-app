import React from 'react';
import { 
  SmartphoneCharging, 
  Tv, 
  Zap, 
  Car, 
  CreditCard, 
  Wifi, 
  Coins, 
  ShieldAlert,
  Flame,
  Droplet
} from 'lucide-react';

export default function ServicesGrid({ onSelectService }) {
  const billServices = [
    { id: 'mobile', name: 'Mobile Recharge', icon: SmartphoneCharging, color: 'text-blue-600 bg-blue-50' },
    { id: 'dth', name: 'DTH Recharge', icon: Tv, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { id: 'fastag', name: 'FASTag', icon: Car, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'creditcard', name: 'Credit Card Bill', icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
    { id: 'broadband', name: 'Broadband', icon: Wifi, color: 'text-teal-600 bg-teal-50' },
    { id: 'gas', name: 'Gas Cylinder', icon: Flame, color: 'text-rose-600 bg-rose-50' },
    { id: 'water', name: 'Water Bill', icon: Droplet, color: 'text-sky-600 bg-sky-50' }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Recharges & Bill Payments
          </h2>
          <p className="text-[10px] text-slate-600">Bharat Bill Payment System (BBPS)</p>
        </div>
        <span className="text-[11px] font-semibold text-fintech-cyan bg-cyan-50 px-2 py-0.5 rounded-full">
          Cashback 2%
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {billServices.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition text-center group"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 ${service.color} group-hover:scale-110 transition-transform shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 leading-tight">
                {service.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
