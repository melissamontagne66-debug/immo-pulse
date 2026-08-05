import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEuro(value: number, options?: { maximumFractionDigits?: number; compact?: boolean }) {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    notation: options?.compact ? 'compact' : 'standard',
    compactDisplay: options?.compact ? 'short' : 'long',
  });
  return formatter.format(value);
}

export function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
