import React from 'react';
import { Bell, ShieldCheck, QrCode, Search, User, Sparkles } from 'lucide-react';

export default function Header({ onOpenScanner, onOpenProfile }) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-fintech-blue via-[#003b9b] to-[#0052cc] text-white shadow-md">
      {/* Sleek integrated status bar */}
      <div className="bg-[#001844]/80 px-4 py-1 text-[11px] font-medium flex items-center justify-between border-b border-white/10 text-cyan-200 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="tracking-wide">ApexPay Enterprise &bull; Secure UPI 2.0 Testnet</span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Status */}
        <div className="flex items-center gap-2.5">
          <div 
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center cursor-pointer hover:bg-white/20 transition shadow-inner group"
            title="Account & Passbook"
          >
            <img 
              src="/icon.svg" 
              alt="ApexPay Logo" 
              className="w-full h-full object-contain drop-shadow group-hover:scale-105 transition-transform" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                ApexPay
              </span>
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
            </div>
            <span className="text-[11px] text-cyan-100 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              UPI Sandbox Active
            </span>
          </div>
        </div>

        {/* Right: Quick Icons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenScanner}
            title="Scan any QR"
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition text-white border border-white/20"
          >
            <QrCode className="w-5 h-5 text-cyan-200" />
          </button>
          <button 
            title="Notifications"
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition text-white border border-white/20 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-400"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
