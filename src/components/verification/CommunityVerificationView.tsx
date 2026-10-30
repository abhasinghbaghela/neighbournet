import React, { useState } from 'react';
import {
  CheckSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  ExternalLink,
  Award,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { Incident } from '../../types';

interface CommunityVerificationViewProps {
  onSelectIncident?: (incident: Incident) => void;
}

export const CommunityVerificationView: React.FC<CommunityVerificationViewProps> = ({
  onSelectIncident
}) => {
  const { incidents, verifyIncident } = useIncidents();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  // Unverified or disputed tickets in this ward
  const unverifiedList = incidents.filter(i => i.status === 'Unverified' || i.status === 'Disputed');

  const filtered = unverifiedList.filter(i => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.location?.address?.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pine-800 dark:bg-pine-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pine-800 dark:text-pine-400 font-mono">
              CITIZEN QUORUM ENGINE • WARD 14
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Community Hazard Verification
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Decentralized consensus verification. Co-sign genuine local incidents or flag erroneous reports. Verified consensus triggers automatic municipal crew dispatch.
          </p>
        </div>

        {/* Reputation Karma Reward Badge */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Earn +25 Karma
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Per confirmed honest verification
            </p>
          </div>
        </div>
      </div>

      {/* Quorum Overview Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Citizen Quorum</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{unverifiedList.length} Tickets</p>
          <p className="text-[11px] text-pine-800 dark:text-pine-400 font-semibold mt-0.5">Awaiting 5 co-signatures</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Quorum Status</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Tier II Guardian</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">High Weighting Consensus</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dispatched Yesterday</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">8 Hazards</p>
          <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold mt-0.5">Avg SLA Response: 4.2h</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter unverified hazard reports in Ward 14..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-xs focus:outline-none focus:ring-2 focus:ring-pine-800 dark:text-white placeholder:text-slate-400"
        />
      </div>

      {/* Verification Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-750">
            <CheckSquare className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">All Clear in Ward 14</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No unverified hazard reports currently pending quorum. Excellent civic participation!
            </p>
          </div>
        ) : (
          filtered.map(inc => {
            const hasUpvoted = inc.upvotes?.includes(user.uid);
            const hasDisputed = inc.disputes?.includes(user.uid);
            const neededVotes = Math.max(0, 5 - inc.confirmationsCount);

            return (
              <div
                key={inc.id}
                className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-charcoal-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {inc.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Severity: {inc.severity}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      #{inc.id}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-pine-800 dark:text-pine-400">
                    {neededVotes} more co-signatures required
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {inc.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {inc.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-pine-800 dark:text-pine-400 flex-shrink-0" />
                  <span>{inc.location?.address}</span>
                </div>

                {/* Quorum Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Quorum Progress</span>
                    <span>{inc.confirmationsCount} / 5 Confirmations</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-charcoal-800 overflow-hidden">
                    <div
                      className="h-full bg-pine-800 dark:bg-pine-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (inc.confirmationsCount / 5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Vote Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-charcoal-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => verifyIncident(inc.id, true)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        hasUpvoted
                          ? 'bg-pine-800 text-white shadow-sm'
                          : 'bg-pine-50 dark:bg-pine-950/60 hover:bg-pine-100 border border-pine-200 dark:border-pine-800 text-pine-800 dark:text-pine-300'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Confirm Report ({inc.confirmationsCount})</span>
                    </button>

                    <button
                      onClick={() => verifyIncident(inc.id, false)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        hasDisputed
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-charcoal-800 hover:bg-rose-50 text-slate-600 dark:text-slate-300 hover:text-rose-600'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Dispute</span>
                    </button>
                  </div>

                  {onSelectIncident && (
                    <button
                      onClick={() => onSelectIncident(inc)}
                      className="text-xs font-bold text-pine-800 dark:text-pine-400 hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Dossier</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
