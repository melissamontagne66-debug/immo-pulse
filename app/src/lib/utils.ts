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

// Clé de date YYYY-MM-DD en heure LOCALE (à utiliser partout à la place de
// date.toISOString().split('T')[0] qui bascule sur le jour UTC).
export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Re-parse une clé YYYY-MM-DD en Date locale (new Date('YYYY-MM-DD') parse en UTC).
export function parseLocalDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
