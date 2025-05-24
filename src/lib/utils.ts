import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency with symbol
export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

// Format date with options
export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
}

// Format time with options
export function formatTime(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    ...options,
  }).format(date);
}

// Calculate time difference between two timezones
export function getTimeDifference(timezone1: string, timezone2: string): string {
  const now = new Date();
  
  const time1 = new Date(now.toLocaleString('en-US', { timeZone: timezone1 }));
  const time2 = new Date(now.toLocaleString('en-US', { timeZone: timezone2 }));
  
  const diffMs = time1.getTime() - time2.getTime();
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
  
  if (diffHrs === 0) return 'Same time';
  
  const sign = diffHrs > 0 ? '+' : '';
  return `${sign}${diffHrs} hours`;
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}