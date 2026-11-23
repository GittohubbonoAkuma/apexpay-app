/**
 * UPI URI & QR Code Parser Utility
 * Parses standard UPI Intent strings:
 * upi://pay?pa=payee@bank&pn=Payee%20Name&am=150.00&cu=INR&tn=Order%20Payment
 */

export function parseUPIString(rawString) {
  if (!rawString || typeof rawString !== 'string') {
    return null;
  }

  const trimmed = rawString.trim();

  // If it's a standard UPI URL
  if (trimmed.startsWith('upi://pay') || trimmed.includes('?pa=')) {
    try {
      // Normalise URL for URLSearchParams
      const queryString = trimmed.includes('?') ? trimmed.split('?')[1] : trimmed;
      const params = new URLSearchParams(queryString);

      const pa = params.get('pa') || ''; // Payee Address (VPA)
      const pn = params.get('pn') ? params.get('pn') : ''; // Payee Name
      const am = params.get('am') || ''; // Amount (optional)
      const cu = params.get('cu') || 'INR'; // Currency
      const tn = params.get('tn') ? params.get('tn') : ''; // Transaction Note
      const mc = params.get('mc') || ''; // Merchant Code

      // Format display name
      const displayName = pn || (pa ? pa.split('@')[0].replace(/[._-]/g, ' ').toUpperCase() : 'Merchant / User');

      return {
        isValid: Boolean(pa),
        vpa: pa,
        name: displayName,
        amount: am ? parseFloat(am) : null,
        currency: cu,
        note: tn,
        merchantCode: mc,
        raw: trimmed
      };
    } catch (e) {
      console.warn('Error parsing UPI URL params:', e);
    }
  }

  // If it's directly a VPA like "john.doe@okaxis" or "9876543210@paytm"
  if (/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(trimmed)) {
    const rawName = trimmed.split('@')[0].replace(/[._-]/g, ' ');
    return {
      isValid: true,
      vpa: trimmed,
      name: rawName.charAt(0).toUpperCase() + rawName.slice(1),
      amount: null,
      currency: 'INR',
      note: 'Transfer via ApexPay',
      merchantCode: '',
      raw: trimmed
    };
  }

  // If it's a 10-digit mobile number
  if (/^[6-9]\d{9}$/.test(trimmed)) {
    return {
      isValid: true,
      vpa: `${trimmed}@apexpay`,
      name: `User (+91 ${trimmed})`,
      amount: null,
      currency: 'INR',
      note: 'Mobile Transfer',
      merchantCode: '',
      raw: trimmed
    };
  }

  return {
    isValid: false,
    vpa: '',
    name: 'Unknown Target',
    amount: null,
    currency: 'INR',
    note: '',
    merchantCode: '',
    raw: trimmed
  };
}
