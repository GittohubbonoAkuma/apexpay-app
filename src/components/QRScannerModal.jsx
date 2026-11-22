import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, Image as ImageIcon, Zap, AlertCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { parseUPIString, SAMPLE_UPI_TARGETS } from '../utils/upiParser';

export default function QRScannerModal({ isOpen, onClose, onTargetDetected }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'manual'
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize camera scanner when modal opens
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopScanner();
      return;
    }

    let isMounted = true;
    const scannerElementId = 'html5-qrcode-reader';

    const startCamera = async () => {
      try {
        setCameraError(null);
        setIsScanning(true);

        const html5QrCode = new Html5Qrcode(scannerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false
        });
        scannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (!isMounted) return;
            handleDecodedText(decodedText);
          },
          () => {
            // ongoing scan tick, ignore
          }
        );
      } catch (err) {
        if (!isMounted) return;
        console.warn('Camera start issue:', err);
        setCameraError(
          err?.name === 'NotAllowedError'
            ? 'Camera permission was denied. Please allow camera access or use the presets below.'
            : 'Unable to start camera. You can use image upload or preset demo targets.'
        );
        setIsScanning(false);
      }
    };

    const timer = setTimeout(() => {
      startCamera();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen, activeTab]);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Scanner stop error:', e);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleDecodedText = async (decodedText) => {
    await stopScanner();
    const parsed = parseUPIString(decodedText);
    if (parsed) {
      onTargetDetected(parsed);
    } else {
      alert('Unrecognized QR format. Please scan a valid UPI QR code.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("hidden-file-reader");
      const decodedText = await html5QrCode.scanFile(file, true);
      handleDecodedText(decodedText);
    } catch (err) {
      alert('Could not detect a valid QR code in this image.');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const parsed = parseUPIString(manualInput);
    if (parsed.isValid) {
      stopScanner();
      onTargetDetected(parsed);
    } else {
      alert('Please enter a valid UPI ID (e.g., merchant@upi) or 10-digit mobile number.');
    }
  };

  const handleSelectPreset = (preset) => {
    stopScanner();
    const target = {
      isValid: true,
      vpa: preset.vpa,
      name: preset.name,
      amount: preset.suggestedAmount,
      currency: 'INR',
      note: `Payment for ${preset.category}`,
      merchantCode: '5411',
      raw: `upi://pay?pa=${preset.vpa}&pn=${encodeURIComponent(preset.name)}&am=${preset.suggestedAmount}`
    };
    onTargetDetected(target);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 max-w-md mx-auto animate-fadeIn">
      {/* Hidden file scanner div */}
      <div id="hidden-file-reader" className="hidden"></div>

      {/* Top Header */}
      <div className="flex items-center justify-between text-white py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Camera className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Scan UPI QR Code</h3>
            <p className="text-[11px] text-slate-300">Point at any BharatQR or UPI QR</p>
          </div>
        </div>

        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-white/10 p-1 rounded-xl my-2 border border-white/10">
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'camera' ? 'bg-cyan-500 text-slate-900 shadow' : 'text-slate-300 hover:text-white'
          }`}
        >
          Camera Scanner
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'manual' ? 'bg-cyan-500 text-slate-900 shadow' : 'text-slate-300 hover:text-white'
          }`}
        >
          Enter UPI / Phone
        </button>
      </div>

      {/* Center Scanning Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-2">
        {activeTab === 'camera' ? (
          <div className="relative w-full max-w-[290px] aspect-square rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl bg-slate-950 flex items-center justify-center">
            {/* The scanner renders into this element */}
            <div id="html5-qrcode-reader" className="w-full h-full object-cover"></div>

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl shadow-[0_0_10px_#00baf2]" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl shadow-[0_0_10px_#00baf2]" />
              </div>

              {/* Animated Laser Scanning Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00baf2] animate-bounce-short" />

              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl shadow-[0_0_10px_#00baf2]" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl shadow-[0_0_10px_#00baf2]" />
              </div>
            </div>

            {/* Error or Fallback Message */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col items-center justify-center text-center text-white z-20">
                <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                <p className="text-xs text-slate-200 mb-3">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-cyan-500 text-slate-900 font-bold text-xs rounded-lg hover:bg-cyan-400 transition"
                >
                  Upload QR Image
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-5 text-white">
            <h4 className="text-sm font-bold mb-1">Direct Transfer</h4>
            <p className="text-xs text-slate-400 mb-4">Enter Payee's UPI ID or Mobile Number</p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  UPI ID or Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. rahul@okaxis or 9876543210"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-mono"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <span>Proceed to Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Gallery Image Upload button */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition border border-white/10"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
            <span>Upload QR from Gallery</span>
          </button>
        </div>
      </div>

      {/* Bottom Presets (Awesome for college presentations!) */}
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-3 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span>Demo QR Presets (Quick Test)</span>
          </span>
          <span className="text-[10px] text-slate-400">Click to simulate scan</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_UPI_TARGETS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(item)}
              className="p-2 bg-slate-800 hover:bg-slate-700/80 active:scale-95 transition text-left rounded-xl border border-slate-700/60"
            >
              <div className="text-xs font-bold text-white truncate">{item.name}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{item.vpa}</div>
              <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">₹{item.suggestedAmount}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
