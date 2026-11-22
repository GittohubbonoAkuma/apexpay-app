# ApexPay - FinTech & Digital Wallet Platform (Academic Prototype)

A modern, high-polish FinTech UI and UPI QR payment simulator built for software development courses, UI/UX presentations, and software engineering projects.

---

## 🌟 Key Features

1. **Dashboard & Digital Wallet:**
   * Dynamic wallet balance display with toggle eye icon.
   * Add money modal to top-up demo balance at any time.
   * Copyable UPI ID (`student.dev@apexpay`).
   * Bharat Bill Payment System (BBPS) interactive services grid.

2. **UPI QR Code Scanner & Parser:**
   * **Real Camera Scanning:** Uses `html5-qrcode` to access laptop or phone camera and scan real UPI QR codes.
   * **Standard UPI Intent Parsing:** Automatically extracts payee name (`pn`), UPI address (`pa`), amount (`am`), and transaction notes (`tn`).
   * **QR Image Upload:** Allows selecting a saved QR code image from the file picker.
   * **Presentation Presets:** Built-in one-click demo targets (e.g., Campus Cafeteria, Bookstore) so you can demonstrate the entire flow even if no external QR is handy.
   * **Manual UPI / Phone Entry:** Direct P2P transfer by entering a UPI ID or 10-digit mobile number.

3. **Payment & Celebration Flow:**
   * Amount keypad with quick chips (+₹100, +₹200, +₹500, +₹1000).
   * Payment source selector (ApexPay Wallet vs. HDFC Bank A/c).
   * 3-stage animated transaction processing screen.
   * Celebratory success screen with:
     * High-resolution **confetti burst** (`canvas-confetti`).
     * Harmonic **payment chime** synthesized via the Web Audio API.
     * **Merchant Soundbox Voice Alert:** Uses browser speech synthesis to announce: *"Payment of ₹... received successfully on ApexPay"*.
     * Full transaction reference number (UTR), timestamp, and shareable receipt.

4. **Passbook & Local Ledger:**
   * Debits and credits tracked locally in `localStorage`.
   * Search transactions by name, UPI ID, or Ref number.
   * Filter by All, Paid (Debits), and Received (Credits).
   * Click any transaction to open its digital receipt.
   * Reset data button to reset back to initial defaults.

---

## 🚀 How to Run the App

### 1. Start the Development Server
Open PowerShell or your terminal in this directory:
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

### 2. Testing on a Mobile Phone (Same Wi-Fi)
To scan real QR codes with your mobile phone camera:
```bash
npm run dev -- --host
```
Vite will show a Network URL like `http://192.168.x.x:3000`. Open that link in your phone's browser!

---

## 📁 Project Structure

```
apexpay-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── utils/
    │   ├── upiParser.js       # UPI intent URI parser & sample presets
    │   ├── audioChime.js      # Web Audio API chime synthesizer
    │   └── storage.js         # LocalStorage ledger & balance state
    └── components/
        ├── Header.jsx         # App bar & project badge
        ├── BalanceCard.jsx    # Wallet balance card
        ├── QuickActions.jsx   # 4 circular UPI transfer actions
        ├── ServicesGrid.jsx   # BBPS bill payments grid
        ├── RecentTransactions.jsx # Passbook preview
        ├── QRScannerModal.jsx # Camera QR scanner & presets
        ├── PaymentModal.jsx   # Amount & payment source entry
        ├── PaymentProcessingModal.jsx # Simulated NPCI switch loader
        ├── PaymentSuccessModal.jsx    # Green checkmark & confetti
        ├── AddMoneyModal.jsx  # Wallet top-up
        ├── PassbookModal.jsx  # Full transaction history ledger
        └── ReceiptDetailModal.jsx # Printable receipt
```
