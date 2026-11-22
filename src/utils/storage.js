const STORAGE_KEYS = {
  BALANCE: 'apexpay_wallet_balance',
  TRANSACTIONS: 'apexpay_transactions',
};

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-8921831',
    refNo: 'UPI/402819827391',
    type: 'DEBIT',
    amount: 140.0,
    title: 'Cafe Coffee Day',
    subtitle: 'Paid to ccd.central@icici',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'SUCCESS',
    category: 'Food & Dining'
  },
  {
    id: 'TXN-8919240',
    refNo: 'UPI/402791823902',
    type: 'CREDIT',
    amount: 2500.0,
    title: 'Added to Wallet',
    subtitle: 'Via HDFC Bank Account ••4819',
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'SUCCESS',
    category: 'Top Up'
  },
  {
    id: 'TXN-8914102',
    refNo: 'UPI/402681902831',
    type: 'DEBIT',
    amount: 320.0,
    title: 'Campus Stationery & Print',
    subtitle: 'Paid to print.campus@okaxis',
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'SUCCESS',
    category: 'Stationery'
  },
  {
    id: 'TXN-8908819',
    refNo: 'UPI/402519283719',
    type: 'DEBIT',
    amount: 799.0,
    title: 'Jio Fiber Broadband',
    subtitle: 'Bill Payment (BBPS)',
    date: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'SUCCESS',
    category: 'Utilities'
  }
];

export function getStoredBalance() {
  const val = localStorage.getItem(STORAGE_KEYS.BALANCE);
  if (val !== null) {
    const num = parseFloat(val);
    if (!isNaN(num)) return num;
  }
  return 4850.0; // Default demo balance
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
  return INITIAL_TRANSACTIONS;
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
    balance: 4850.0,
    transactions: INITIAL_TRANSACTIONS
  };
}
