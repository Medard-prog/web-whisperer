
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
  }).format(price);
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function calculateProjectPrice(
  pageCount: number,
  designComplexity: string,
  hasCMS: boolean,
  hasEcommerce: boolean,
  hasSEO: boolean,
  hasMaintenance: boolean
) {
  const basePrice = 1500;
  const designPrices: Record<string, number> = {
    simple: 0,
    standard: 500,
    premium: 1200,
  };
  
  const pagePricing = 150 * pageCount;
  const designPricing = designPrices[designComplexity] || 0;
  const cmsPricing = hasCMS ? 800 : 0;
  const ecommercePricing = hasEcommerce ? 1500 : 0;
  const seoPricing = hasSEO ? 600 : 0;
  const maintenancePricing = hasMaintenance ? 200 : 0;
  
  return basePrice + pagePricing + designPricing + cmsPricing + ecommercePricing + seoPricing + maintenancePricing;
}
