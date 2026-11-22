import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import QuickActions from './components/QuickActions';
import ServicesGrid from './components/ServicesGrid';
import RecentTransactions from './components/RecentTransactions';
import QRScannerModal from './components/QRScannerModal';
import PaymentModal from './components/PaymentModal';
import PaymentProcessingModal from './components/PaymentProcessingModal';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import AddMoneyModal from './components/AddMoneyModal';
import PassbookModal from './components/PassbookModal';
import ReceiptDetailModal from './components/ReceiptDetailModal';

import {
  getStoredBalance,
  saveStoredBalance,
  getStoredTransactions,
  saveTransaction,
  resetDemoStorage
} from './utils/storage';
import { Volume2, VolumeX, Shield, Smartphone, QrCode, Sparkles } from 'lucide-react';

export default function App() {
  const [balance, setBalance] = useState(getStoredBalance);
  const [transactions, setTransactions] = useState(getStoredTransactions);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [processingData, setProcessingData] = useState(null);
  const [successTxn, setSuccessTxn] = useState(null);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isPassbookOpen, setIsPassbookOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Soundbox Voice Alert toggle (Announces payment via Text-to-Speech like real merchant soundboxes)
  const [soundboxEnabled, setSoundboxEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Handle QR code detection from scanner
  const handleTargetDetected = (target) => {
    setIsScannerOpen(false);
    setPaymentTarget(target);
  };

  // 2. Open manual pay modal with preset mode
  const handleOpenManualPay = (type) => {
    if (type === 'mobile') {
      setPaymentTarget({
        isValid: true,
        vpa: '9876543210@apexpay',
        name: 'Friend / Contact (+91 9876543210)',
        amount: null,
        currency: 'INR',
        note: 'P2P Mobile Transfer',
        merchantCode: ''
      });
    } else if (type === 'upi') {
      setIsScannerOpen(true); // Opens scanner with manual UPI tab option
    } else if (type === 'self') {
      showToast('Self transfer between linked banks simulated');
    }
  };

  // 3. User clicked "Pay" inside PaymentModal
  const handleConfirmPayment = (paymentData) => {
    setPaymentTarget(null);
    setProcessingData(paymentData);
  };

  // 4. Processing finished -> Create record, deduct balance, trigger soundbox & success modal
  const handleProcessingFinished = () => {
    if (!processingData) return;

    const { target, amount, note, source } = processingData;

    // Deduct balance on every payment
    const newBalance = Math.max(0, balance - amount);
    setBalance(newBalance);
    saveStoredBalance(newBalance);

    const randomUpiRef = 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000);
    const newTxn = {
      id: 'TXN-' + Math.floor(1000000 + Math.random() * 9000000),
      refNo: randomUpiRef,
      type: 'DEBIT',
      amount: amount,
      title: target.name || 'Merchant Payment',
      subtitle: `Paid to ${target.vpa}`,
      date: new Date().toISOString(),
      status: 'SUCCESS',
      category: 'UPI Payment',
      paymentSource: source
    };

    const updatedTxns = saveTransaction(newTxn);
    setTransactions(updatedTxns);
    setProcessingData(null);
    setSuccessTxn(newTxn);

    // Simulated Soundbox audio announcement (Text-to-Speech)
    if (soundboxEnabled && 'speechSynthesis' in window) {
      try {
        const text = `Payment of ${amount} rupees received successfully on ApexPay`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    }
  };

  // 5. Handle Add Money
  const handleAddMoneySuccess = (amount) => {
    const newBal = balance + amount;
    setBalance(newBal);
    saveStoredBalance(newBal);

    const randomRef = 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000);
    const topUpTxn = {
      id: 'TXN-' + Math.floor(1000000 + Math.random() * 9000000),
      refNo: randomRef,
      type: 'CREDIT',
      amount: amount,
      title: 'Added to Wallet',
      subtitle: 'Via HDFC Bank Account ••4819',
      date: new Date().toISOString(),
      status: 'SUCCESS',
      category: 'Top Up',
      paymentSource: 'HDFC Bank ••4819'
    };

    const updated = saveTransaction(topUpTxn);
    setTransactions(updated);
    setIsAddMoneyOpen(false);
    showToast(`₹${amount} successfully added to wallet!`);
  };

  // 6. Reset demo data
  const handleResetData = () => {
    if (confirm('Reset wallet balance and demo transactions to default?')) {
      const reset = resetDemoStorage();
      setBalance(reset.balance);
      setTransactions(reset.transactions);
      setIsPassbookOpen(false);
      showToast('Demo data reset to initial values');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-cyan-500 selection:text-white">
      {/* Mobile viewport container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative pb-20">
        
        {/* Top App Header */}
        <Header
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenProfile={() => setIsPassbookOpen(true)}
        />

        {/* Scrollable Main Body */}
        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
          
          {/* Main Wallet Balance Card */}
          <BalanceCard
            balance={balance}
            onUpdateBalance={(newBal) => {
              setBalance(newBal);
              saveStoredBalance(newBal);
              showToast(`Balance updated to ₹${newBal.toLocaleString('en-IN')}`);
            }}
            onOpenAddMoney={() => setIsAddMoneyOpen(true)}
            onOpenPassbook={() => setIsPassbookOpen(true)}
          />

          {/* Quick UPI Transfer Action Buttons */}
          <QuickActions
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenManualPay={handleOpenManualPay}
          />

          {/* Soundbox Speaker Simulator Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-3.5 flex items-center justify-between border border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Merchant Soundbox Voice</span>
                  <span className="text-[9px] bg-cyan-400/20 text-cyan-300 font-semibold px-1.5 py-0.2 rounded-full">TTS</span>
                </div>
                <div className="text-[10px] text-slate-400">Audio voice announces payment success</div>
              </div>
            </div>

            <button
              onClick={() => setSoundboxEnabled(!soundboxEnabled)}
              className={`p-2 rounded-xl transition ${
                soundboxEnabled
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
              title={soundboxEnabled ? "Soundbox Audio ON" : "Soundbox Audio OFF"}
            >
              {soundboxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Services & Bill Payments Grid */}
          <ServicesGrid
            onSelectService={(service) => {
              showToast(`${service.name} bill payment simulated!`);
            }}
          />

          {/* Recent Passbook Transactions */}
          <RecentTransactions
            transactions={transactions}
            onViewAll={() => setIsPassbookOpen(true)}
            onSelectTxn={(txn) => setSelectedReceipt(txn)}
          />

          {/* Official FinTech Trust Footer */}
          <div className="text-center py-4 text-[11px] text-slate-400 space-y-1 border-t border-slate-200/60 mt-4 pb-20">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-600">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Encrypted &bull; ISO/IEC 27001 Certified Architecture</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Powered by NPCI Unified Payments Interface &bull; Real-time Settlement
            </p>
          </div>
        </main>

        {/* Native Fixed Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-2">
          <div className="flex items-center justify-between relative">
            
            {/* Home Tab */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex flex-col items-center py-1 px-3 text-fintech-blue font-bold text-[10px] group"
            >
              <div className="w-5 h-5 flex items-center justify-center mb-0.5">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              </div>
              <span>Home</span>
            </button>

            {/* Passbook Tab */}
            <button 
              onClick={() => setIsPassbookOpen(true)}
              className="flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-900 font-semibold text-[10px] transition"
            >
              <div className="w-5 h-5 flex items-center justify-center mb-0.5">
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <span>Passbook</span>
            </button>

            {/* Raised Center Scan & Pay Button */}
            <div className="relative -top-5 flex flex-col items-center">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-fintech-blue via-[#0048bd] to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-900/30 active:scale-95 transition border-4 border-white"
                title="Scan Any QR"
              >
                <QrCode className="w-6 h-6 stroke-[2.3]" />
              </button>
              <span className="text-[10px] font-extrabold text-fintech-blue mt-0.5">Scan & Pay</span>
            </div>

            {/* Add Money Tab */}
            <button 
              onClick={() => setIsAddMoneyOpen(true)}
              className="flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-900 font-semibold text-[10px] transition"
            >
              <div className="w-5 h-5 flex items-center justify-center mb-0.5">
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              </div>
              <span>Add Cash</span>
            </button>

            {/* Profile Tab */}
            <button 
              onClick={() => setIsPassbookOpen(true)}
              className="flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-900 font-semibold text-[10px] transition"
            >
              <div className="w-5 h-5 flex items-center justify-center mb-0.5">
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span>Profile</span>
            </button>

          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl animate-fadeIn border border-slate-700 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* --- MODALS --- */}

        {/* 1. Camera & UPI QR Scanner Modal */}
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onTargetDetected={handleTargetDetected}
        />

        {/* 2. Payment Amount & Source Modal */}
        {paymentTarget && (
          <PaymentModal
            target={paymentTarget}
            walletBalance={balance}
            onClose={() => setPaymentTarget(null)}
            onConfirmPayment={handleConfirmPayment}
          />
        )}

        {/* 3. Sleek Processing State */}
        {processingData && (
          <PaymentProcessingModal
            paymentData={processingData}
            onFinished={handleProcessingFinished}
          />
        )}

        {/* 4. Payment Success Celebration Modal */}
        {successTxn && (
          <PaymentSuccessModal
            txn={successTxn}
            onClose={() => setSuccessTxn(null)}
            onViewPassbook={() => {
              setSuccessTxn(null);
              setIsPassbookOpen(true);
            }}
          />
        )}

        {/* 5. Add Money to Demo Wallet Modal */}
        <AddMoneyModal
          isOpen={isAddMoneyOpen}
          onClose={() => setIsAddMoneyOpen(false)}
          onAddSuccess={handleAddMoneySuccess}
        />

        {/* 6. Passbook & History Modal */}
        <PassbookModal
          isOpen={isPassbookOpen}
          onClose={() => setIsPassbookOpen(false)}
          balance={balance}
          transactions={transactions}
          onSelectTxn={(txn) => setSelectedReceipt(txn)}
          onResetData={handleResetData}
        />

        {/* 7. Receipt Detail Modal */}
        <ReceiptDetailModal
          txn={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      </div>
    </div>
  );
}
