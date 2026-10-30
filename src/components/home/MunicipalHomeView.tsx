import React, { useState } from 'react';
import {
  Radio,
  Gauge,
  Camera,
  CheckCheck,
  Building2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Upload,
  Send,
  ExternalLink,
  Plus,
  Compass,
  Download,
  Filter,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { Incident } from '../../types';
import { MUNICIPAL_DEPARTMENTS } from '../../services/mockData';

interface MunicipalHomeViewProps {
  onOpenReportModal: () => void;
  setActiveTab: (tab: string) => void;
  onSelectIncident?: (incident: Incident) => void;
}

export const MunicipalHomeView: React.FC<MunicipalHomeViewProps> = ({
  onOpenReportModal,
  setActiveTab,
  onSelectIncident
}) => {
  const { incidents, assignIncidentDepartment, updateIncidentStatus } = useIncidents();
  const { user } = useAuth();

  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedIncidentForUpdate, setSelectedIncidentForUpdate] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');

  // Department filters
  const deptFilters = [
    'All',
    'BWSSB Water Supply',
    'BESCOM Electricity Board',
    'Municipal Road Works (PWD)',
    'Garbage & Sanitation'
  ];

  // In-progress or verified incidents for municipal action
  const activeWorkOrders = incidents.filter(i => i.status !== 'Resolved');
  const criticalOrders = activeWorkOrders.filter(i => i.severity === 'Critical');
  const inProgressOrders = activeWorkOrders.filter(i => i.status === 'In Progress');

  const filteredOrders = activeWorkOrders.filter(inc => {
    if (selectedDeptFilter === 'All') return true;
    if (selectedDeptFilter === 'BWSSB Water Supply') return inc.category.toLowerCase().includes('water') || inc.assignedTo?.includes('BWSSB');
    if (selectedDeptFilter === 'BESCOM Electricity Board') return inc.category.toLowerCase().includes('electric') || inc.assignedTo?.includes('BESCOM');
    if (selectedDeptFilter === 'Municipal Road Works (PWD)') return inc.category.toLowerCase().includes('road') || inc.assignedTo?.includes('PWD');
    if (selectedDeptFilter === 'Garbage & Sanitation') return inc.category.toLowerCase().includes('sanitation') || inc.category.toLowerCase().includes('garbage');
    return true;
  });

  const handleUpdateStatus = (incidentId: string, newStatus: any) => {
    updateIncidentStatus(
      incidentId,
      newStatus,
      statusNote || `Status updated to ${newStatus} by Municipal Officer ${user.name}.`,
      proofPhotoUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    );
    setSelectedIncidentForUpdate(null);
    setStatusNote('');
    setProofPhotoUrl('');
    alert(`Work order #${incidentId} updated to ${newStatus}.`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none animate-in fade-in duration-150">
      {/* Top Banner / Jurisdiction Tag */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 font-mono">
            MUNICIPAL FIELD DISPATCH & SLA COMMAND • WARD 14 JURISDICTION
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Municipal Officer Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Welcome, Officer {user.name}. You have {activeWorkOrders.length} active civic work orders across BWSSB, BESCOM, and PWD road maintenance units.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pine-800 hover:bg-pine-900 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Field Map</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-charcoal-700"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export SLA Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Municipal KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Work Orders */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Active Work Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {activeWorkOrders.length}
              </span>
              <span className="text-xs font-bold text-rose-600">
                {criticalOrders.length} Critical
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {inProgressOrders.length} crews on-ground
            </p>
          </div>
        </div>

        {/* Card 2: Average SLA Speed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Average SLA Velocity</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                3.8 <span className="text-base text-slate-500 font-semibold">hrs</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                SLA &lt;6h
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              96.4% Compliance Rate
            </p>
          </div>
        </div>

        {/* Card 3: Pending Resolution Evidence */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Pending Field Proofs</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                2
              </span>
              <span className="text-xs font-semibold text-amber-600">
                Needs verification photo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Field crew upload required
            </p>
          </div>
        </div>

        {/* Card 4: Verified Resolved */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Resolved to Date</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {incidents.filter(i => i.status === 'Resolved').length || 18}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                100% Closed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Audited by citizen consensus
            </p>
          </div>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {deptFilters.map(dept => {
          const isActive = selectedDeptFilter === dept;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left 2 Columns for Work Orders + Right Column for Dispatch Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Work Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Escalated Municipal Work Orders ({filteredOrders.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">Sorted by SLA Urgency</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-charcoal-900 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">All Work Orders Completed</p>
              <p className="text-xs text-slate-400 mt-0.5">No open tickets in this department filter.</p>
            </div>
          ) : (
            filteredOrders.map(inc => {
              const isSelected = selectedIncidentForUpdate === inc.id;

              return (
                <div
                  key={inc.id}
                  className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">#{inc.id}</span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {inc.assignedTo || 'Unassigned'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${inc.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                        {inc.severity}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      Status: {inc.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {inc.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {inc.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 text-xs text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{inc.location?.address}</span>
                  </div>

                  {/* Officer Action Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-charcoal-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(inc.id, 'In Progress')}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors"
                      >
                        Deploy Crew
                      </button>

                      <button
                        onClick={() => setSelectedIncidentForUpdate(isSelected ? null : inc.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        Complete & Resolve
                      </button>
                    </div>

                    {onSelectIncident && (
                      <button
                        onClick={() => onSelectIncident(inc)}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span>Inspect Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Resolution Input Panel if open */}
                  {isSelected && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700 space-y-2.5 animate-in fade-in duration-150">
                      <p className="font-bold text-xs text-slate-800 dark:text-white">
                        Submit Official Municipal Resolution Evidence:
                      </p>
                      <input
                        type="text"
                        value={statusNote}
                        onChange={e => setStatusNote(e.target.value)}
                        placeholder="Resolution description (e.g. 12-inch water main valve repaired and pressure restored)..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 dark:text-white"
                      />
                      <input
                        type="text"
                        value={proofPhotoUrl}
                        onChange={e => setProofPhotoUrl(e.target.value)}
                        placeholder="Resolution Photo URL (Optional evidence proof)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 dark:text-white"
                      />
                      <button
                        onClick={() => handleUpdateStatus(inc.id, 'Resolved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Sign & Mark Ticket Resolved
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Live Crew Dispatch Telemetry & SLA Tracking */}
        <div className="space-y-4">
          {/* Active Field Units */}
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <span>Field Units Status</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'BWSSB Rapid Unit #3', sector: 'Sector 4 Junction', status: 'On Site', color: 'bg-emerald-100 text-emerald-800' },
                { name: 'BESCOM Emergency Desk', sector: 'Defence Colony', status: 'En Route', color: 'bg-amber-100 text-amber-800' },
                { name: 'PWD Asphalt Team #1', sector: '100ft Road Corridor', status: 'Dispatched', color: 'bg-blue-100 text-blue-800' }
              ].map(unit => (
                <div key={unit.name} className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-700 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{unit.name}</p>
                    <p className="text-[10px] text-slate-400">{unit.sector}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${unit.color}`}>
                    {unit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Department Reassignment Tool */}
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Jurisdiction Routing</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automatic escalation routes water bursts to BWSSB, snapped wires to BESCOM, and potholes to PWD.
            </p>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-xs text-blue-900 dark:text-blue-300">
              ⚡ SLA Target: Critical life hazards require initial quarantine within 45 minutes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
