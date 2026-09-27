import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  const absLat = Math.abs(lat);
  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = Math.round(((absLat - latDeg) * 60 - latMin) * 60);

  const absLng = Math.abs(lng);
  const lngDeg = Math.floor(absLng);
  const lngMin = Math.floor((absLng - lngDeg) * 60);
  const lngSec = Math.round(((absLng - lngDeg) * 60 - lngMin) * 60);

  return `${latDeg}°${latMin.toString().padStart(2, '0')}'${latSec.toString().padStart(2, '0')}" ${latDir}, ${lngDeg}°${lngMin.toString().padStart(2, '0')}'${lngSec.toString().padStart(2, '0')}" ${lngDir}`;
}

export function formatUtcDateTime(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'UNKNOWN UTC';
  return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

export function formatUtcTimeOnly(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '--:--:--';
  return d.toTimeString().substring(0, 8) + ' UTC';
}

export function formatEtaCountdown(targetDate: string): string {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return 'ARRIVED';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) {
    return `T-${days}d ${hours}h ${minutes}m`;
  }
  return `T-${hours}h ${minutes}m`;
}

export function formatTimeAgo(dateString: string): string {
  const d = new Date(dateString).getTime();
  const now = Date.now();
  const diffSec = Math.floor((now - d) / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`;
  }
  return `${kg.toLocaleString()} kg`;
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}k`;
  }
  return `$${amount.toLocaleString()}`;
}
