
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // diff in seconds
  
  if (diff < 60) {
    return 'Acum câteva secunde';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `Acum ${minutes} ${minutes === 1 ? 'minut' : 'minute'}`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `Acum ${hours} ${hours === 1 ? 'oră' : 'ore'}`;
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `Acum ${days} ${days === 1 ? 'zi' : 'zile'}`;
  } else if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800);
    return `Acum ${weeks} ${weeks === 1 ? 'săptămână' : 'săptămâni'}`;
  } else {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('ro-RO', options);
  }
}
