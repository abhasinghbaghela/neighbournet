import { Incident } from '../types';

const OFFLINE_QUEUE_KEY = 'neighbournet_offline_reports_queue';

export function saveReportOffline(report: Partial<Incident>): void {
  try {
    const existing = getOfflineQueue();
    existing.push({
      ...report,
      id: report.id || `offline-${Date.now()}`,
      createdAt: report.createdAt || new Date().toISOString()
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to store report offline:', e);
  }
}

export function getOfflineQueue(): any[] {
  try {
    const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearOfflineQueue(): void {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch (e) {
    console.error('Failed to clear offline queue:', e);
  }
}

export function removeOfflineReport(id: string): void {
  try {
    const existing = getOfflineQueue();
    const filtered = existing.filter(item => item.id !== id);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove offline report:', e);
  }
}
