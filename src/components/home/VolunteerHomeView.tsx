import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  Award,
  Users,
  Clock,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { Incident } from '../../types';

interface VolunteerHomeViewProps {
  onOpenReportModal: () => void;
  setActiveTab: (tab: string) => void;
  onSelectIncident?: (incident: Incident) => void;
}

export const VolunteerHomeView: React.FC<VolunteerHomeViewProps> = ({
  onOpenReportModal,
  setActiveTab,
  onSelectIncident
}) => {
  const { incidents, verifyIncident, flagIncident } = useIncidents();
  const { user } = useAuth();

  const [activeTabFilter, setActiveTabFilter] = useState<'unverified' | 'disputed' | 'all'>('unverified');

  const unverifiedList = incidents.filter(i => i.status === 'Unverified');
  const disputedList = incidents.filter(i => i.status === 'Disputed');

  const displayedList = activeTabFilter === 'unverified'
    ? unverifiedList
    : activeTabFilter === 'disputed'
    ? disputedList
    : incidents;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none animate-in fade-in duration-150">
      {/* Top Banner / Jurisdiction Tag */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400 font-mono">
            COMMUNITY SENTINEL DESK • WARD 14 QUORUM ACCELERATOR
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Volunteer Sentinel Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Welcome, Sentinel {user.name}. Your civic verifications carry 2.5x consensus weighting to accelerate municipal field dispatch for genuine community hazards.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setActiveTab('verify')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <CheckSquare className="w-4 h-4 text-white" />
              <span>Full Quorum Queue</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-charcoal-700"
            >
              <span>+ Log Verified Hazard</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Volunteer Sentinel KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Quorum */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Pending Quorum Votes</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {unverifiedList.length}
              </span>
              <span className="text-xs font-bold text-purple-600">
                Awaiting Review
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your co-sign drives dispatch
            </p>
          </div>
        </div>

        {/* Card 2: Disputed Reports */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Disputed Reports</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {disputedList.length}
              </span>
              <span className="text-xs font-bold text-amber-600">
                Conflicting Reports
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Requires ground audit
            </p>
          </div>
        </div>

        {/* Card 3: Sentinel Quorum Multiplier */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Sentinel Weighting</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                2.5x
              </span>
              <span className="text-xs font-bold text-emerald-600">
                Quorum Power
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tier II Guardian distinction
            </p>
          </div>
        </div>

        {/* Card 4: Karma Earned */}
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Sentinel Karma</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {user.xp}
              </span>
              <span className="text-xs font-bold text-amber-600">
                Rank #4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              +25 Karma per honest audit
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-charcoal-800 pb-2">
        <button
          onClick={() => setActiveTabFilter('unverified')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabFilter === 'unverified'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Awaiting Sentinel Quorum ({unverifiedList.length})
        </button>

        <button
          onClick={() => setActiveTabFilter('disputed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabFilter === 'disputed'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Disputed Reports Review ({disputedList.length})
        </button>

        <button
          onClick={() => setActiveTabFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabFilter === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          All Ward Reports ({incidents.length})
        </button>
      </div>

      {/* Main Grid: Left 2 Columns for Moderation Cards + Right Column for Sentinel Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-2 space-y-4">
          {displayedList.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-charcoal-900 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">All Sentinel Reviews Up to Date</p>
              <p className="text-xs text-slate-400 mt-0.5">No reports currently awaiting quorum action.</p>
            </div>
          ) : (
            displayedList.map(inc => {
              const hasUpvoted = inc.upvotes?.includes(user.uid);
              const hasDisputed = inc.disputes?.includes(user.uid);

              return (
                <div
                  key={inc.id}
                  className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-charcoal-800 text-slate-800 dark:text-slate-200">
                        {inc.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Severity: {inc.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{inc.id}</span>
                    </div>

                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                      {Math.max(0, 5 - inc.confirmationsCount)} co-signatures needed
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{inc.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{inc.description}</p>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 text-xs text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span className="truncate">{inc.location?.address}</span>
                  </div>

                  {/* Sentinel Action Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-charcoal-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyIncident(inc.id, true)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          hasUpvoted
                            ? 'bg-purple-700 text-white'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Confirm Genuine Hazard (+25 Karma)</span>
                      </button>

                      <button
                        onClick={() => verifyIncident(inc.id, false)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          hasDisputed
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Dispute</span>
                      </button>
                    </div>

                    {onSelectIncident && (
                      <button
                        onClick={() => onSelectIncident(inc)}
                        className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                      >
                        <span>Audit Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Sentinel Code of Conduct & Quorum Guidance */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Sentinel Code of Conduct</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Volunteers preserve community trust by verifying photographic evidence and physical hazard accuracy before dispatch escalation.
            </p>

            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>Check photo timestamps against weather and daylight conditions.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>Ensure road craters specify approximate depth and lane obstruction.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>Dispute duplicate reports if spatial cluster did not auto-merge.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
