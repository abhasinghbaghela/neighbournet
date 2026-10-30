import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  User,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Camera,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Incident } from '../../types';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

interface IncidentDossierModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal?: () => void;
}

export const IncidentDossierModal: React.FC<IncidentDossierModalProps> = ({
  incident,
  isOpen,
  onClose,
  onOpenReportModal
}) => {
  const { verifyIncident } = useIncidents();
  const { user } = useAuth();
  const { t } = useI18n();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'evidence' | 'comments'>('timeline');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([
    {
      id: 'c-1',
      author: 'Ravi M. (Resident)',
      time: '15m ago',
      text: 'Verified this morning on commute. Pothole is deep and waterlogged.'
    },
    {
      id: 'c-2',
      author: 'BWSSB Field Desk',
      time: '5m ago',
      text: 'Official dispatch order logged. Crew en route with maintenance patcher.'
    }
  ]);

  if (!isOpen || !incident) return null;

  const hasUpvoted = incident.upvotes?.includes(user.uid);
  const hasDisputed = incident.disputes?.includes(user.uid);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        author: `${user.name} (${user.role})`,
        time: 'Just now',
        text: commentText.trim()
      }
    ]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-charcoal-900 rounded-3xl border border-slate-200 dark:border-charcoal-750 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-charcoal-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pine-800 dark:bg-pine-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              CIVIC INCIDENT DOSSIER • #{incident.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
              title="Share Incident URL"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {copied && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
              Incident link copied to clipboard!
            </div>
          )}

          {/* Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-pine-50 dark:bg-pine-950/60 text-pine-800 dark:text-pine-300 text-xs font-bold border border-pine-200 dark:border-pine-800">
                {incident.category}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                Severity: {incident.severity}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                Status: {incident.status}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {incident.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Location & Metadata Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-100 dark:border-charcoal-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-pine-800 dark:text-pine-400" />
              <span>{incident.location?.address}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Coordinates: {incident.location?.lat.toFixed(4)}, {incident.location?.lng.toFixed(4)}</span>
              <span>Ward: {incident.location?.ward || 'Ward 14'}</span>
              <span>Reported by: {incident.isAnonymous ? 'Anonymous Resident' : (incident.reporterName || 'Resident')}</span>
              <span>Reported: {new Date(incident.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Photo Evidence if present */}
          {incident.imageUrl && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Ground Photo Evidence
              </label>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-charcoal-700 max-h-64">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Community Quorum Verification Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-charcoal-800 border border-slate-200/80 dark:border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Community Quorum Consensus
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  5 verified resident confirmations trigger municipal field escalation.
                </p>
              </div>

              <span className="text-xs font-extrabold text-pine-800 dark:text-pine-400">
                {incident.confirmationsCount} / 5 Confirmations
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-charcoal-700 overflow-hidden">
              <div
                className="h-full bg-pine-800 dark:bg-pine-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (incident.confirmationsCount / 5) * 100)}%` }}
              />
            </div>

            {/* Voting Buttons */}
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => verifyIncident(incident.id, true)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  hasUpvoted
                    ? 'bg-pine-800 text-white shadow-sm'
                    : 'bg-white dark:bg-charcoal-700 hover:bg-pine-50 dark:hover:bg-charcoal-600 border border-slate-200 dark:border-charcoal-600 text-pine-800 dark:text-pine-300'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Confirm Hazard ({incident.confirmationsCount})</span>
              </button>

              <button
                onClick={() => verifyIncident(incident.id, false)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  hasDisputed
                    ? 'bg-rose-600 text-white'
                    : 'bg-white dark:bg-charcoal-700 hover:bg-rose-50 dark:hover:bg-charcoal-600 border border-slate-200 dark:border-charcoal-600 text-rose-600 dark:text-rose-400'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Dispute Report</span>
              </button>
            </div>
          </div>

          {/* Dossier Tabs: Timeline & Dispatch History */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-charcoal-800 pb-2">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`text-xs font-bold pb-2 -mb-2 border-b-2 transition-colors ${
                  activeTab === 'timeline'
                    ? 'border-pine-800 text-pine-800 dark:border-pine-400 dark:text-pine-300'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Dispatch Timeline & Audit
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`text-xs font-bold pb-2 -mb-2 border-b-2 transition-colors ${
                  activeTab === 'comments'
                    ? 'border-pine-800 text-pine-800 dark:border-pine-400 dark:text-pine-300'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Field Updates ({comments.length})
              </button>
            </div>

            {activeTab === 'timeline' && (
              <div className="space-y-3 pt-1">
                {incident.timeline && incident.timeline.length > 0 ? (
                  incident.timeline.map((event, idx) => (
                    <div key={event.id || idx} className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-pine-800 dark:bg-pine-400 flex-shrink-0 mt-1" />
                        {idx < incident.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 dark:bg-charcoal-700 my-1" />
                        )}
                      </div>
                      <div className="space-y-0.5 pb-2">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {event.title}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{event.actor} ({event.role})</span>
                          <span>•</span>
                          <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Incident submitted and queued for verification.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4 pt-1">
                <div className="space-y-2">
                  {comments.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-700 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 dark:text-slate-200">{c.author}</span>
                        <span className="text-[10px] text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{c.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add on-ground remark or update..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-xs focus:outline-none focus:ring-1 focus:ring-pine-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-pine-800 hover:bg-pine-900 text-white text-xs font-bold"
                  >
                    Post
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
