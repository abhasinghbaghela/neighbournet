import React, { useState } from 'react';
import {
  Plus,
  Compass,
  Flame,
  Heart,
  Gauge,
  Award,
  Zap,
  Droplets,
  Construction,
  Trash2,
  Clock,
  CheckCircle2,
  MapPin,
  ArrowUpRight,
  ShieldAlert,
  GitFork,
  Radio,
  ThumbsUp,
  AlertOctagon,
  Sparkles,
  ExternalLink,
  Users,
  Shield,
  Building2,
  UserCheck
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { Incident, UserRole } from '../../types';

import { MunicipalHomeView } from './MunicipalHomeView';
import { VolunteerHomeView } from './VolunteerHomeView';
import { AdminHomeView } from './AdminHomeView';

interface HomeViewProps {
  onOpenReportModal: () => void;
  onOpenSosModal?: () => void;
  onStartDemoTour?: () => void;
  setActiveTab: (tab: string) => void;
  onSelectIncident?: (incident: Incident) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenReportModal,
  setActiveTab,
  onSelectIncident
}) => {
  const { incidents, verifyIncident } = useIncidents();
  const { user, setRole } = useAuth();
  const { t } = useI18n();

  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  // Role-based dedicated dashboard delegation
  if (user.role === 'authority') {
    return (
      <div>
        <RoleSwitcherBar currentRole={user.role} onSelectRole={setRole} />
        <MunicipalHomeView
          onOpenReportModal={onOpenReportModal}
          setActiveTab={setActiveTab}
          onSelectIncident={onSelectIncident}
        />
      </div>
    );
  }

  if (user.role === 'volunteer') {
    return (
      <div>
        <RoleSwitcherBar currentRole={user.role} onSelectRole={setRole} />
        <VolunteerHomeView
          onOpenReportModal={onOpenReportModal}
          setActiveTab={setActiveTab}
          onSelectIncident={onSelectIncident}
        />
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div>
        <RoleSwitcherBar currentRole={user.role} onSelectRole={setRole} />
        <AdminHomeView
          onOpenReportModal={onOpenReportModal}
          setActiveTab={setActiveTab}
          onSelectIncident={onSelectIncident}
        />
      </div>
    );
  }

  // Resident / Citizen View (Matches Prototype Screenshot 1 exactly)
  const totalActive = incidents.filter(i => i.status !== 'Resolved').length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const inTriageCount = incidents.filter(i => i.status === 'In Progress' || i.status === 'Community Verified').length;
  const unverifiedCount = incidents.filter(i => i.status === 'Unverified').length;

  const filters = [
    { id: 'All', label: 'All' },
    { id: 'Critical', label: 'Critical' },
    { id: 'Water', label: 'Water' },
    { id: 'Roads', label: 'Roads' },
    { id: 'Electrical', label: 'Electrical' },
    { id: 'Sanitation', label: 'Sanitation' }
  ];

  const filteredIncidents = incidents.filter(inc => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Critical') return inc.severity === 'Critical' || inc.severity === 'High';
    if (selectedFilter === 'Water') return inc.category.toLowerCase().includes('water');
    if (selectedFilter === 'Roads') return inc.category.toLowerCase().includes('road') || inc.category.toLowerCase().includes('pothole');
    if (selectedFilter === 'Electrical') return inc.category.toLowerCase().includes('electric') || inc.category.toLowerCase().includes('light');
    if (selectedFilter === 'Sanitation') return inc.category.toLowerCase().includes('sanitation') || inc.category.toLowerCase().includes('waste') || inc.category.toLowerCase().includes('garbage');
    return true;
  });

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('water')) return <Droplets className="w-3.5 h-3.5 text-sky-500" />;
    if (cat.includes('road') || cat.includes('pothole')) return <Construction className="w-3.5 h-3.5 text-amber-500" />;
    if (cat.includes('electric') || cat.includes('light')) return <Zap className="w-3.5 h-3.5 text-yellow-500" />;
    if (cat.includes('sanitation') || cat.includes('garbage')) return <Trash2 className="w-3.5 h-3.5 text-emerald-500" />;
    return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
      case 'High':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Role Switcher Bar */}
      <RoleSwitcherBar currentRole={user.role} onSelectRole={setRole} />

      {/* Top Banner / Sector Jurisdiction Tag (Matches Screenshot 1) */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pine-800 dark:bg-pine-400" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-pine-800 dark:text-pine-400 font-mono">
            WARD 14 (GREENWOOD HEIGHTS) • SECTOR 4 JURISDICTION
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user.name || 'Silver'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {unverifiedCount} active community reports need resident verification. Your quorum drives municipal priority dispatch.
            </p>
          </div>

          {/* Action Buttons: [+ Report Incident] and [Live Map] */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pine-800 hover:bg-pine-900 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Report Incident</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold transition-all"
            >
              <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Live Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat KPI Cards (Matches Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active In Ward */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Active In Ward</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalActive || 4}
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {criticalCount || 2} Critical
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {inTriageCount || 3} under active triage
            </p>
          </div>
        </div>

        {/* Card 2: Ward Health */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Ward Health</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Heart className="w-4 h-4 fill-current/20" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                86<span className="text-lg text-slate-400 font-semibold">/100</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                +4.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Responsive index
            </p>
          </div>
        </div>

        {/* Card 3: Avg SLA Speed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Avg SLA Speed</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                4.2 <span className="text-base text-slate-500 font-semibold">hrs</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                &lt;6h target
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              96.4% SLA Compliance
            </p>
          </div>
        </div>

        {/* Card 4: Your Karma */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Your Karma</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {user.xp || 485}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Rank #4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Tier II Guardian
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Matches Screenshot 1) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {filters.map(f => {
          const isActive = selectedFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left 2 Columns for Incident Cards + Right 1 Column for Municipal Dispatch Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2-card width on desktop): Incident Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-charcoal-900 rounded-2xl border border-slate-200 dark:border-charcoal-750">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No incidents found for this filter.
              </p>
            </div>
          ) : (
            filteredIncidents.slice(0, 6).map(inc => {
              const isVerified = inc.status === 'Community Verified' || inc.status === 'Authority Verified' || inc.status === 'In Progress' || inc.status === 'Resolved';
              const neededConfirmations = Math.max(0, 3 - inc.confirmationsCount);

              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident && onSelectIncident(inc)}
                  className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 hover:border-pine-800/40 shadow-civic-sm transition-all cursor-pointer group"
                >
                  {/* Card Header Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-charcoal-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                        {getCategoryIcon(inc.category)}
                        <span>{inc.category}</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getSeverityBadgeClass(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      {isVerified ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Community Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Unverified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="mt-3 space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-pine-800 dark:group-hover:text-pine-300 transition-colors">
                      {inc.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {inc.description}
                    </p>
                  </div>

                  {/* Location Pill */}
                  <div className="mt-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 text-slate-600 dark:text-slate-300 text-xs border border-slate-100 dark:border-charcoal-700">
                    <MapPin className="w-3.5 h-3.5 text-pine-800 dark:text-pine-400 flex-shrink-0" />
                    <span className="truncate">{inc.location?.address || 'Indiranagar, Bangalore'}</span>
                  </div>

                  {/* Footer Verification Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-charcoal-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-pine-800 dark:text-pine-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                      <div className="w-24 sm:w-36 h-2 rounded-full bg-slate-100 dark:bg-charcoal-800 overflow-hidden">
                        <div
                          className="h-full bg-pine-800 dark:bg-pine-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (inc.confirmationsCount / 3) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {isVerified ? 'Consensus Achieved' : `${neededConfirmations} more needed`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Municipal Dispatch Feed + Spatial AI Deduplication (Matches Screenshot 1) */}
        <div className="space-y-4">
          {/* Card 1: Municipal Dispatch Feed */}
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-pine-800 dark:text-pine-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Municipal Dispatch Feed
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {/* Unit 1: BWSSB Rapid Unit */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-100 dark:border-charcoal-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-sky-700 dark:text-sky-400 font-bold">
                    BWSSB Rapid Unit #3
                  </span>
                  <span className="text-[10px] text-slate-400">10m ago</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  Valve isolation underway at Sector 4. Crew working on 12-Inch water main.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400">Ticket: #INC-2024-8841</span>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-pine-800 dark:text-pine-400 font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Track</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Unit 2: BESCOM Emergency Unit */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-100 dark:border-charcoal-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-amber-700 dark:text-amber-400 font-bold">
                    BESCOM Emergency Unit
                  </span>
                  <span className="text-[10px] text-slate-400">35m ago</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  Feeder Line 3 breaker tripped remotely to secure exposed cable near Park Gate.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400">Ticket: #INC-2024-8854</span>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-pine-800 dark:text-pine-400 font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Track</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Spatial AI Deduplication (Matches Screenshot 1) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-pine-800 dark:text-pine-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Spatial AI Deduplication
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-pine-50 dark:bg-pine-950/60 text-pine-800 dark:text-pine-300 font-bold text-[10px]">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Auto-clustering concurrent resident reports within 150m radius. Prevents municipal ticket spam while consolidating priority urgency.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-700 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Clustered Reports
                </p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  14 Residents
                </p>
              </div>
              <button
                onClick={() => setActiveTab('clusters')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-charcoal-750 border border-slate-200 dark:border-charcoal-700 text-xs font-semibold text-pine-800 dark:text-pine-300 hover:bg-slate-100 dark:hover:bg-charcoal-700 transition-colors"
              >
                Inspect Clusters →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick-Switch Role Pill Bar
const RoleSwitcherBar: React.FC<{ currentRole: UserRole; onSelectRole: (role: UserRole) => void }> = ({
  currentRole,
  onSelectRole
}) => {
  const roles: { role: UserRole; label: string; desc: string; icon: any; color: string }[] = [
    { role: 'resident', label: 'Resident Citizen', desc: 'Ward Reports & Consensus Quorum', icon: Users, color: 'hover:border-pine-800' },
    { role: 'authority', label: 'Municipal Officer', desc: 'Field Orders, BWSSB/BESCOM & SLAs', icon: Building2, color: 'hover:border-blue-600' },
    { role: 'volunteer', label: 'Community Volunteer', desc: 'Quorum Acceleration & Moderation', icon: ShieldAlert, color: 'hover:border-purple-600' },
    { role: 'admin', label: 'Society Admin', desc: 'Approvals, Notices & Governance', icon: Shield, color: 'hover:border-emerald-600' }
  ];

  const currentRoleObj = roles.find(r => r.role === currentRole) || roles[0];

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-charcoal-850 border border-slate-200/90 dark:border-charcoal-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-pine-800 text-white flex items-center justify-center flex-shrink-0">
          <currentRoleObj.icon className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Dashboard:
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-pine-100 dark:bg-pine-950/60 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800">
              {currentRoleObj.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            {currentRoleObj.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-400 font-semibold mr-1 hidden lg:inline">
          Switch View:
        </span>
        {roles.map(r => {
          const Icon = r.icon;
          const isCurrent = currentRole === r.role;

          return (
            <button
              key={r.role}
              onClick={() => onSelectRole(r.role)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isCurrent
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-charcoal-750 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-700 border border-slate-200/70 dark:border-charcoal-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
