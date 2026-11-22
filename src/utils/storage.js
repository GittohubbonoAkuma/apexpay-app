const STORAGE_KEYS = {
  BALANCE: 'apexpay_wallet_balance',
  TRANSACTIONS: 'apexpay_transactions',
};

export function getStoredBalance() {
  const val = localStorage.getItem(STORAGE_KEYS.BALANCE);
  if (val !== null) {
    const num = parseFloat(val);
    if (!isNaN(num)) return num;
  }
  return 10000.0; // Default starting balance
}

export function saveStoredBalance(newBalance) {
  localStorage.setItem(STORAGE_KEYS.BALANCE, newBalance.toString());
}

export function getStoredTransactions() {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  return []; // Start with empty history
}

export function saveTransaction(newTxn) {
  const current = getStoredTransactions();
  const updated = [newTxn, ...current];
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  return updated;
}

export function resetDemoStorage() {
  localStorage.removeItem(STORAGE_KEYS.BALANCE);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  return {
    balance: 10000.0,
    transactions: []
  };
}
