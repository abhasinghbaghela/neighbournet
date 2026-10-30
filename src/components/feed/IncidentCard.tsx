import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  Flag,
  Share2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Building2,
  CheckCheck
} from 'lucide-react';
import { Incident } from '../../types';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

interface IncidentCardProps {
  incident: Incident;
  onOpenFlagModal: (incidentId: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onOpenFlagModal
}) => {
  const { verifyIncident } = useIncidents();
  const { user } = useAuth();
  const { t } = useI18n();
  const [showTimeline, setShowTimeline] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const hasUpvoted = incident.upvotes.includes(user.uid);
  const hasDisputed = incident.disputes.includes(user.uid);

  const getStatusBadge = () => {
    switch (incident.status) {
      case 'Community Verified':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t('statCommVerified')}
          </span>
        );
      case 'Authority Verified':
      case 'In Progress':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-950/60 text-lavender-200 border border-violet-500/40">
            <Building2 className="w-3.5 h-3.5 text-violet-400" />
            {incident.status}
          </span>
        );
      case 'Resolved':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
            <CheckCheck className="w-3.5 h-3.5 text-teal-400" />
            {t('statResolved')}
          </span>
        );
      case 'Disputed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            {t('statDisputed')}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-charcoal-800 text-lavender-300 border border-charcoal-700">
            <Clock className="w-3.5 h-3.5 text-lavender-400" />
            {t('statUnverified')}
          </span>
        );
    }
  };

  const getSeverityBadge = () => {
    switch (incident.severity) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-violet-950/60 text-lavender-300 border-violet-500/30';
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const timeAgo = (dateStr: string) => {
    const hours = Math.round(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60)
    );
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.round(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-3xl p-5 hover:border-violet-500/40 transition-all shadow-xl">
      {/* Top Meta Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={
              incident.reporterPhoto ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
            }
            alt={incident.reporterName}
            className="w-10 h-10 rounded-2xl object-cover border border-violet-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {incident.reporterName}
              </span>
              {incident.isAnonymous && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-charcoal-800 text-lavender-400 border border-charcoal-700 font-mono">
                  Anonymous
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-lavender-400">
              <MapPin className="w-3 h-3 text-violet-400" />
              <span className="truncate max-w-[200px] sm:max-w-xs text-lavender-300">
                {incident.location.address}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">{timeAgo(incident.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5">
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getSeverityBadge()}`}
          >
            {incident.severity}
          </span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Title & Category */}
      <div className="mt-3.5">
        <div className="text-[11px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">
          {incident.category}
        </div>
        <h3 className="font-extrabold text-base text-white">
          {incident.title}
        </h3>
        <p className="text-xs text-lavender-300 mt-1.5 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Clustered Duplicate Badge */}
      {incident.mergedReportsCount > 1 && (
        <div className="mt-3 p-2.5 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between text-xs text-lavender-200">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <span>
              <b>Auto-Clustered Duplicate:</b> {incident.mergedReportsCount} independent reports merged into this ticket.
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-violet-600/40 text-lavender-100 font-mono font-bold">
            +{incident.mergedReportsCount - 1} duplicate
          </span>
        </div>
      )}

      {/* Photograph Evidence */}
      {incident.imageUrl && (
        <div className="mt-3.5 relative rounded-2xl overflow-hidden border border-charcoal-700 bg-charcoal-900">
          <img
            src={incident.imageUrl}
            alt={incident.title}
            className="w-full h-56 object-cover hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Resolution Notes Banner if resolved */}
      {incident.status === 'Resolved' && incident.resolutionNotes && (
        <div className="mt-3 p-3 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-xs text-teal-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-teal-300">
            <CheckCheck className="w-4 h-4 text-teal-400" />
            Resolution Report:
          </p>
          <p className="text-lavender-200">{incident.resolutionNotes}</p>
          {incident.resolvedBy && (
            <p className="text-[10px] text-teal-400/80 font-mono">
              Resolved by {incident.resolvedBy} • {timeAgo(incident.resolvedAt || incident.updatedAt)}
            </p>
          )}
        </div>
      )}

      {/* Assigned Authority Badge */}
      {incident.assignedTo && (
        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-lavender-400">
          <Building2 className="w-3.5 h-3.5 text-violet-400" />
          <span>Assigned to:</span>
          <span className="font-bold text-lavender-200">{incident.assignedTo}</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-charcoal-700/80 flex flex-wrap items-center justify-between gap-3">
        {/* Verification Vote Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => verifyIncident(incident.id, true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hasUpvoted
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-charcoal-800 hover:bg-emerald-600/20 text-lavender-300 hover:text-emerald-300 border border-charcoal-700'
            }`}
            title="Confirm this incident is real and ongoing (+25 XP)"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Confirm ({incident.confirmationsCount})</span>
          </button>

          <button
            onClick={() => verifyIncident(incident.id, false)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hasDisputed
                ? 'bg-rose-600 text-white'
                : 'bg-charcoal-800 hover:bg-rose-600/20 text-lavender-400 hover:text-rose-300 border border-charcoal-700'
            }`}
            title="Dispute (Not true or resolved)"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            {incident.disputesCount > 0 && <span>({incident.disputesCount})</span>}
          </button>

          {/* Timeline toggle */}
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-lavender-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <span>Timeline</span>
            {showTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Share & Report False buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-lavender-400 hover:text-white hover:bg-charcoal-800 transition-colors text-xs flex items-center gap-1"
            title="Share incident link"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copySuccess && <span className="text-[10px] text-emerald-400 font-mono">Copied!</span>}
          </button>

          <button
            onClick={() => onOpenFlagModal(incident.id)}
            className="p-2 rounded-xl text-lavender-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title={t('flagFalse')}
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Evidence Timeline */}
      {showTimeline && incident.timeline && (
        <div className="mt-4 pt-4 border-t border-charcoal-700/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-lavender-400 mb-3">
            Incident Audit Timeline
          </p>
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-charcoal-700">
            {incident.timeline.map((event, idx) => (
              <div key={event.id || idx} className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-violet-500 ring-4 ring-charcoal-850" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {event.title}
                    </span>
                    <span className="text-[10px] text-lavender-400 font-mono">
                      {timeAgo(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-lavender-300 mt-0.5">
                    {event.description}
                  </p>
                  <p className="text-[10px] text-violet-400/90 font-mono mt-0.5">
                    Actor: {event.actor} ({event.role})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
