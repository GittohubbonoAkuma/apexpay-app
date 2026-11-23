import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Image as ImageIcon, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { parseUPIString } from '../utils/upiParser';

export default function QRScannerModal({ isOpen, onClose, onTargetDetected, initialMode = 'camera' }) {
  const [activeTab, setActiveTab] = useState('camera');
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);
  const onTargetDetectedRef = useRef(onTargetDetected);

  useEffect(() => {
    onTargetDetectedRef.current = onTargetDetected;
  }, [onTargetDetected]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        // State 2 = SCANNING, State 3 = PAUSED
        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }
      } catch (e) {
        // Ignore stop errors
      }
      try {
        scannerRef.current.clear();
      } catch (e) {
        // Ignore clear errors
      }
      scannerRef.current = null;
    }
  }, []);

  const handleDecodedText = useCallback(async (decodedText) => {
    await stopScanner();
    const parsed = parseUPIString(decodedText);
    if (parsed && parsed.isValid) {
      onTargetDetectedRef.current(parsed);
    } else {
      alert('Unrecognized QR format. Please scan a valid UPI QR code.');
    }
  }, [stopScanner]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setCameraError(null);
    }
  }, [isOpen, initialMode]);

  // Start camera when modal opens
  useEffect(() => {
    mountedRef.current = true;

    if (!isOpen || activeTab !== 'camera') {
      stopScanner();
      return;
    }

    const scannerElementId = 'html5-qrcode-reader';

    const startCamera = async () => {
      // Make sure the DOM element exists
      const el = document.getElementById(scannerElementId);
      if (!el) {
        setCameraError('Scanner element not ready. Please try again.');
        return;
      }

      // Clean up any previous scanner instance
      await stopScanner();

      try {
        setCameraError(null);
        const html5QrCode = new Html5Qrcode(scannerElementId, {
          verbose: false
        });
        scannerRef.current = html5QrCode;

        // Request the rear camera directly; device enumeration can be empty before permission is granted.
        const config = {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.7);
            return { width: qrboxSize, height: qrboxSize };
          },
          aspectRatio: 1.0,
          disableFlip: false
        };

        const onScanSuccess = (decodedText) => {
          if (!mountedRef.current) return;
          handleDecodedText(decodedText);
        };
        const onScanFailure = () => {};

        try {
          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            onScanSuccess,
            onScanFailure
          );
        } catch (rearCameraError) {
          // Desktops and some tablets have only a user-facing camera. Fall back
          // to an available device if the environment-facing constraint fails.
          const cameras = await Html5Qrcode.getCameras();
          if (!cameras.length) throw rearCameraError;
          const backCamera = cameras.find(({ label }) => /back|rear|environment/i.test(label));
          await html5QrCode.start(
            (backCamera || cameras[0]).id,
            config,
            onScanSuccess,
            onScanFailure
          );
        }
      } catch (err) {
        if (!mountedRef.current) return;
        console.warn('Camera error:', err);

        let errorMsg = 'Unable to start camera.';
        const errorText = `${err?.name || ''} ${err?.message || ''}`.toLowerCase();
        if (errorText.includes('permission') || errorText.includes('notallowed') || errorText.includes('denied')) {
          errorMsg = 'Camera permission denied. Please allow camera access in your browser settings and try again.';
        } else if (errorText.includes('notfound') || errorText.includes('no camera')) {
          errorMsg = 'No camera found on this device. Use the manual entry tab or upload a QR image.';
        } else if (errorText.includes('notreadable') || errorText.includes('trackstart')) {
          errorMsg = 'Camera is in use by another app. Close other apps using the camera and try again.';
        } else if (!window.isSecureContext) {
          errorMsg = 'Camera access requires HTTPS or localhost. Open this app over a secure connection.';
        }

        setCameraError(errorMsg);
      }
    };

    // Delay to ensure the DOM has rendered the scanner container
    const timer = setTimeout(startCamera, 500);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen, activeTab, stopScanner, handleDecodedText]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const hiddenId = 'hidden-file-reader';
      const el = document.getElementById(hiddenId);
      if (el) el.innerHTML = '';

      const html5QrCode = new Html5Qrcode(hiddenId, { verbose: false });
      const decodedText = await html5QrCode.scanFile(file, true);
      await html5QrCode.clear();
      handleDecodedText(decodedText);
    } catch (err) {
      alert('Could not detect a valid QR code in this image.');
    }
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const parsed = parseUPIString(manualInput);
    if (parsed && parsed.isValid) {
      stopScanner();
      onTargetDetected(parsed);
    } else {
      alert('Please enter a valid UPI ID (e.g., name@upi) or 10-digit mobile number.');
    }
  };

  const handleRetryCamera = async () => {
    setCameraError(null);
    setActiveTab('manual');
    // Force re-mount by toggling tab
    setTimeout(() => setActiveTab('camera'), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 max-w-md mx-auto">
      {/* Hidden file scanner div */}
      <div id="hidden-file-reader" className="hidden"></div>

      {/* Top Header */}
      <div className="flex items-center justify-between text-white py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Camera className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Scan & Pay</h3>
            <p className="text-[11px] text-slate-300">Point at any UPI QR code</p>
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

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center my-2">
        {activeTab === 'camera' ? (
          <div className="relative w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl bg-slate-950 flex items-center justify-center">
            {/* The scanner renders into this element */}
            <div id="html5-qrcode-reader" className="w-full h-full"></div>

            {/* Target Reticle Overlay */}
            {!cameraError && (
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
                  <div className="w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
                  <div className="w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />
                </div>
              </div>
            )}

            {/* Error state */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/95 p-5 flex flex-col items-center justify-center text-center text-white z-20">
                <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
                <p className="text-xs text-slate-200 mb-4 leading-relaxed">{cameraError}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleRetryCamera}
                    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-cyan-500 text-slate-900 font-bold text-xs rounded-lg hover:bg-cyan-400 transition"
                  >
                    Upload QR Image
                  </button>
                </div>
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
                  placeholder="e.g. name@upi or 9876543210"
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

        {/* Upload QR from gallery */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            capture="environment"
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
    </div>
  );
}
