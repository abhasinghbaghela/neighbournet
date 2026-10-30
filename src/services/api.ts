import { Incident, IncidentStatus } from '../types';

const API_BASE = '/api';

export const backendApi = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', error: (e as any).message };
    }
  },

  async getIncidents(filters?: { category?: string; severity?: string; status?: string; search?: string }) {
    try {
      const query = new URLSearchParams();
      if (filters?.category) query.set('category', filters.category);
      if (filters?.severity) query.set('severity', filters.severity);
      if (filters?.status) query.set('status', filters.status);
      if (filters?.search) query.set('search', filters.search);

      const res = await fetch(`${API_BASE}/incidents?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.data as Incident[];
      }
      return null;
    } catch (e) {
      console.warn('Backend API unavailable, using client store:', e);
      return null;
    }
  },

  async createIncident(incident: Partial<Incident>) {
    try {
      const res = await fetch(`${API_BASE}/incidents/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API create error:', e);
    }
    return null;
  },

  async verifyIncident(incidentId: string, userId: string, isConfirm: boolean) {
    try {
      const res = await fetch(`${API_BASE}/incidents/${incidentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isConfirm })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API verify error:', e);
    }
    return null;
  },

  async assignDepartment(incidentId: string, department: string, officerName?: string) {
    try {
      const res = await fetch(`${API_BASE}/incidents/${incidentId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department, officerName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API assign error:', e);
    }
    return null;
  },

  async updateStatus(
    incidentId: string,
    status: IncidentStatus,
    notes?: string,
    proofUrl?: string,
    officerName?: string
  ) {
    try {
      const res = await fetch(`${API_BASE}/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, proofUrl, officerName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API status error:', e);
    }
    return null;
  },

  async getHealthScore() {
    try {
      const res = await fetch(`${API_BASE}/health-score`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  },

  async triggerSos(details: { lat: number; lng: number; type: string; callerName?: string }) {
    try {
      const res = await fetch(`${API_BASE}/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }
    return null;
  }
};
