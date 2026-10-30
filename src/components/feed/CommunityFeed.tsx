import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  AlertCircle,
  Plus,
  Users
} from 'lucide-react';
import { IncidentCard } from './IncidentCard';
import { FlagModal } from './FlagModal';
import { useIncidents } from '../../context/IncidentContext';
import { useI18n } from '../../context/I18nContext';
import { IncidentCategory, Severity } from '../../types';

interface CommunityFeedProps {
  onOpenReportModal: () => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ onOpenReportModal }) => {
  const {
    incidents,
    activeFilterCategory,
    setActiveFilterCategory,
    activeFilterSeverity,
    setActiveFilterSeverity,
    activeFilterStatus,
    setActiveFilterStatus
  } = useIncidents();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'severity' | 'upvotes'>('recent');
  const [flaggingIncidentId, setFlaggingIncidentId] = useState<string | null>(null);

  // Filter & Search
  const filtered = incidents.filter(inc => {
    if (activeFilterCategory !== 'All' && inc.category !== activeFilterCategory) return false;
    if (activeFilterSeverity !== 'All' && inc.severity !== activeFilterSeverity) return false;
    if (activeFilterStatus !== 'All' && inc.status !== activeFilterStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchDesc = inc.description.toLowerCase().includes(q);
      const matchAddr = inc.location.address?.toLowerCase().includes(q);
      const matchCat = inc.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAddr && !matchCat) return false;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'severity') {
      const weight: Record<Severity, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return weight[b.severity] - weight[a.severity];
    }
    if (sortBy === 'upvotes') {
      return b.confirmationsCount - a.confirmationsCount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const categories: (string | IncidentCategory)[] = [
    'All',
    'Road Hazards & Potholes',
    'Electricity & Outages',
    'Water Leakage & Shortage',
    'Garbage & Sanitation',
    'Theft & Security',
    'Fire & Emergencies',
    'Stray Animals',
    'Civic & Infrastructure'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 select-none">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-400">
              Hyperlocal Community Telemetry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Neighbourhood Safety Feed
          </h1>
          <p className="text-xs sm:text-sm text-lavender-400 mt-1">
            Real-time resident reports, community consensus votes & municipal resolution tracking.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-violet-600 via-violet-500 to-violet-700 text-white shadow-violet-sm hover:brightness-110 active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Hazard</span>
        </button>
      </div>

      {/* Clustered Intelligence Summary Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-charcoal-850 via-charcoal-800 to-charcoal-850 border border-violet-500/30 shadow-xl mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              AI Duplicate Auto-Clustering Active
            </p>
            <p className="text-[11px] text-lavender-300/80">
              Multiple reports within 250m are automatically grouped to prevent spam and boost response speed.
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-mono font-bold text-emerald-400">
            {incidents.filter(i => i.status === 'Resolved').length} Resolved
          </span>
          <span className="text-[10px] text-lavender-400 font-mono block">
            {incidents.length} Total Telemetry Tickets
          </span>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-lavender-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reports by street, keywords, category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-charcoal-850 border border-charcoal-700 focus:border-violet-500 focus:outline-none text-xs text-white placeholder-lavender-500/80 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-charcoal-850 border border-charcoal-700 text-xs text-lavender-300 w-full sm:w-auto justify-between">
              <ArrowUpDown className="w-3.5 h-3.5 text-violet-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="recent" className="bg-charcoal-850 text-white">
                  Most Recent
                </option>
                <option value="severity" className="bg-charcoal-850 text-white">
                  Highest Severity
                </option>
                <option value="upvotes" className="bg-charcoal-850 text-white">
                  Most Confirmed
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                activeFilterCategory === cat
                  ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold shadow-violet-sm'
                  : 'bg-charcoal-850 text-lavender-400 hover:text-white hover:bg-charcoal-800 border border-charcoal-700/80'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="text-center py-16 bg-charcoal-900/40 rounded-3xl border border-dashed border-charcoal-800">
            <AlertCircle className="w-8 h-8 text-lavender-500 mx-auto mb-2" />
            <p className="font-bold text-sm text-lavender-200">No Incidents Found</p>
            <p className="text-xs text-lavender-400 mt-1 max-w-sm mx-auto">
              No reports match your current filter criteria. Try clearing filters or be the first to report!
            </p>
            <button
              onClick={() => {
                setActiveFilterCategory('All');
                setActiveFilterSeverity('All');
                setActiveFilterStatus('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-violet-400 hover:bg-violet-500/10 border border-violet-500/30 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          sorted.map(incident => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onOpenFlagModal={id => setFlaggingIncidentId(id)}
            />
          ))
        )}
      </div>

      {/* Flag False Report Modal */}
      <FlagModal
        incidentId={flaggingIncidentId}
        onClose={() => setFlaggingIncidentId(null)}
      />
    </div>
  );
};
