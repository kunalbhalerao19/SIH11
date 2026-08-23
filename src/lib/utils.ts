import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCrore(lakhs: number): string {
  const crore = lakhs / 100;
  if (crore >= 1000) return `₹${(crore / 1000).toFixed(1)}K Cr`;
  if (crore >= 1) return `₹${crore.toFixed(1)} Cr`;
  return `₹${lakhs.toFixed(1)} L`;
}

export function formatLakh(amount: number): string {
  return `₹${amount.toFixed(2)} L`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

export function formatPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysDiff(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function clampProgress(v: number): number {
  return Math.max(0, Math.min(100, v));
}

export function getProgressColor(pct: number): string {
  if (pct >= 80) return '#16a34a';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}
