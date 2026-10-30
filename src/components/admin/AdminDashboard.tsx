import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building,
  Users,
  Filter,
  ArrowRight,
  Send,
  Sparkles,
  BarChart3,
  ExternalLink,
  Layers,
  CheckCheck,
  Download,
  Megaphone,
  UserCheck,
  UserX,
  FileText,
  Search
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { Incident, IncidentCategory, IncidentStatus, Severity } from '../../types';
import { MUNICIPAL_DEPARTMENTS } from '../../services/mockData';

export const AdminDashboard: React.FC = () => {
  const { incidents, assignIncidentDepartment, updateIncidentStatus } = useIncidents();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'incidents' | 'residents' | 'announcements' | 'analytics'>('incidents');
  const [selectedIncidentForAction, setSelectedIncidentForAction] = useState<Incident | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedDept, setSelectedDept] = useState(MUNICIPAL_DEPARTMENTS[0]);
  const [filterDept, setFilterDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Resident membership approval queue
  const [residentRequests, setResidentRequests] = useState([
    { id: 'req-1', name: 'Rohan Deshmukh', flat: 'Tower B, Flat 402', society: 'Greenwood Heights', date: 'Today, 10:15 AM', status: 'Pending' },
    { id: 'req-2', name: 'Ananya Sen', flat: 'Villa 12, Phase 1', society: 'Greenwood Heights', date: 'Yesterday', status: 'Pending' }
  ]);

  // Announcements
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Scheduled Water Tank Cleaning & Pipeline Flushing',
      body: 'Maintenance team will clean overhead tanks tomorrow between 10:00 AM - 2:00 PM. Alternate supply active.',
      date: 'Today',
      author: 'Society Administration'
    }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnBody, setNewAnnBody] = useState('');

  // Calculations
  const total = incidents.length;
  const critical = incidents.filter(i => i.severity === 'Critical');
  const inProgress = incidents.filter(i => i.status === 'In Progress');
  const resolved = incidents.filter(i => i.status === 'Resolved');
  const unverified = incidents.filter(i => i.status === 'Unverified');

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    if (filterDept !== 'All' && inc.assignedTo !== filterDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return inc.title.toLowerCase().includes(q) || inc.description.toLowerCase().includes(q) || inc.location?.address?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleResolveSubmit = (incidentId: string) => {
    updateIncidentStatus(
      incidentId,
      'Resolved',
      resolutionNote || 'Verified and completed by municipal field officer.',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    );
    setSelectedIncidentForAction(null);
    setResolutionNote('');
  };

  const handleApproveResident = (id: string) => {
    setResidentRequests(prev => prev.filter(r => r.id !== id));
    alert('Resident approved with Verified Resident badge.');
  };

  const handleRejectResident = (id: string) => {
    setResidentRequests(prev => prev.filter(r => r.id !== id));
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnBody) return;
    setAnnouncements([
      {
        id: `ann-${Date.now()}`,
        title: newAnnTitle,
        body: newAnnBody,
        date: 'Just now',
        author: `${user.name} (Admin)`
      },
      ...announcements
    ]);
    setNewAnnTitle('');
    setNewAnnBody('');
    alert('Community announcement broadcasted to all residents.');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = 'ID,Title,Category,Severity,Status,Location,Confirmations,Created\n';
    const rows = incidents.map(i =>
      `"${i.id}","${i.title.replace(/"/g, '""')}","${i.category}","${i.severity}","${i.status}","${i.location?.address?.replace(/"/g, '""') || ''}",${i.confirmationsCount},"${i.createdAt}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CivicQuest_Incidents_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pine-800 dark:bg-pine-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pine-800 dark:text-pine-400 font-mono">
              AUTHORITY & SOCIETY COMMAND CONSOLE • WARD 14
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Municipal & Society Admin Portal
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Dispatch work orders to BWSSB, BESCOM & PWD, moderate resident submissions, verify memberships, and track municipal SLAs.
          </p>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal-900 hover:bg-slate-50 border border-slate-200 dark:border-charcoal-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-pine-800 dark:text-pine-400" />
          <span>Export Reports (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Ward Tickets</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{total}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% telemetry verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Critical Life Hazards</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{critical.length}</p>
          <span className="text-[10px] text-slate-400">Immediate response crew</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Active Field Crews</p>
          <p className="text-2xl font-black text-pine-800 dark:text-pine-400 mt-1">{inProgress.length + 2}</p>
          <span className="text-[10px] text-slate-400">BWSSB, BESCOM, PWD</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Resolved to Date</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{resolved.length}</p>
          <span className="text-[10px] text-slate-400">Verified by photo proof</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-charcoal-800 pb-2">
        {[
          { id: 'incidents', label: 'Incident Dispatch Queue' },
          { id: 'residents', label: `Resident Onboarding (${residentRequests.length})` },
          { id: 'announcements', label: 'Community Announcements' },
          { id: 'analytics', label: 'Civic SLA Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-pine-800 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-charcoal-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INCIDENTS DISPATCH QUEUE */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {/* Search & Department Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search ticket number, location, or problem description..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-xs focus:outline-none focus:ring-1 focus:ring-pine-800 dark:text-white"
              />
            </div>

            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-xs font-semibold focus:outline-none dark:text-white"
            >
              <option value="All">All Municipal Departments</option>
              {MUNICIPAL_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredIncidents.map(inc => (
              <div
                key={inc.id}
                className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{inc.id}</span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-charcoal-800 text-slate-800 dark:text-slate-200">
                      {inc.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${inc.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                      {inc.severity}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-pine-50 dark:bg-pine-950/60 text-pine-800 dark:text-pine-300 border border-pine-200 dark:border-pine-800">
                      {inc.status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500">
                    Assigned: <b className="text-slate-800 dark:text-slate-200">{inc.assignedTo || 'Unassigned'}</b>
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{inc.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{inc.description}</p>
                </div>

                {/* Dispatch Controls */}
                <div className="pt-2 border-t border-slate-100 dark:border-charcoal-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <select
                      onChange={e => assignIncidentDepartment(inc.id, e.target.value)}
                      defaultValue={inc.assignedTo || ''}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-charcoal-700 text-xs bg-slate-50 dark:bg-charcoal-800 dark:text-white"
                    >
                      <option value="" disabled>Assign Field Unit...</option>
                      {MUNICIPAL_DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => updateIncidentStatus(inc.id, 'In Progress', 'Crew dispatched to ground site.')}
                      className="px-3 py-1.5 rounded-lg bg-pine-50 dark:bg-pine-950/60 hover:bg-pine-100 border border-pine-200 dark:border-pine-800 text-xs font-bold text-pine-800 dark:text-pine-300"
                    >
                      Mark In Progress
                    </button>

                    <button
                      onClick={() => handleResolveSubmit(inc.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    >
                      Mark Resolved
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {inc.confirmationsCount} resident confirmations
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RESIDENT ONBOARDING */}
      {activeTab === 'residents' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Society Invitation Code</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Residents can join Ward 14 / Greenwood Heights instantly using code:
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 font-mono text-sm font-bold text-pine-800 dark:text-pine-400 border border-slate-200">
              WARD14-GREENWOOD
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Pending Resident Approval Requests
            </h3>

            {residentRequests.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No pending resident requests.</p>
            ) : (
              residentRequests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{req.name}</h4>
                    <p className="text-[11px] text-slate-500">{req.flat} • {req.society}</p>
                    <span className="text-[10px] text-slate-400">{req.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveResident(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve Resident</span>
                    </button>
                    <button
                      onClick={() => handleRejectResident(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <form onSubmit={handlePublishAnnouncement} className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-pine-800 dark:text-pine-400" />
              <span>Broadcast Society / Ward Announcement</span>
            </h3>

            <input
              type="text"
              value={newAnnTitle}
              onChange={e => setNewAnnTitle(e.target.value)}
              placeholder="Announcement Title (e.g. BESCOM Power Outage Notice)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-charcoal-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pine-800 dark:bg-charcoal-850 dark:text-white"
            />

            <textarea
              value={newAnnBody}
              onChange={e => setNewAnnBody(e.target.value)}
              rows={2}
              placeholder="Details regarding timing, affected sectors, emergency contacts..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-charcoal-700 text-xs focus:outline-none focus:ring-1 focus:ring-pine-800 dark:bg-charcoal-850 dark:text-white"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-pine-800 hover:bg-pine-900 text-white text-xs font-bold"
            >
              Broadcast to All Ward Residents
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Published Announcements</h3>
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{ann.title}</h4>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{ann.body}</p>
                <span className="text-[10px] text-pine-800 dark:text-pine-400 font-semibold block pt-1">
                  Posted by {ann.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CIVIC SLA ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Average Resolution Time</p>
              <p className="text-3xl font-black text-pine-800 dark:text-pine-400 mt-2">4.2 Hours</p>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Under 6h target SLA</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Quorum Conversion Rate</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">92.4%</p>
              <p className="text-[11px] text-slate-500 mt-1">Verified vs. False reports</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Community Guardians</p>
              <p className="text-3xl font-black text-amber-600 mt-2">142 Residents</p>
              <p className="text-[11px] text-slate-500 mt-1">Active weekly voters</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
