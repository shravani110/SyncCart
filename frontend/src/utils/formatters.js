export const CURRENCY_SYMBOLS = {
  INR: 'Rs. ',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const formatCurrency = (amount, currencyCode = 'INR') => {
  const num = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currencyCode] || 'Rs. ';

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return `${symbol}${formatted}`;
};

export const formatPercent = (value) => {
  const num = Number(value) || 0;
  return `${num.toFixed(1)}%`;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getUserTimeZone = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Default to Asia/Kolkata (IST) if the browser environment reports UTC or unconfigured
    if (!tz || tz.toUpperCase() === 'UTC' || tz.toUpperCase() === 'ETC/UTC') {
      return 'Asia/Kolkata';
    }
    return tz;
  } catch (e) {
    return 'Asia/Kolkata';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const tz = getUserTimeZone();

  if (Array.isArray(dateString)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateString;
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    });
  }

  let iso = String(dateString).trim();
  if (iso.includes(' ') && !iso.includes('T')) {
    iso = iso.replace(' ', 'T');
  }
  // If the server string is an ISO timestamp without timezone offset, append 'Z' (UTC)
  // so the browser converts it to the user's local timezone (e.g. IST).
  if (iso.includes('T') && !iso.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(iso)) {
    iso = `${iso}Z`;
  }
  const date = new Date(iso);
  if (isNaN(date.getTime())) return String(dateString);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: tz,
  });
};
