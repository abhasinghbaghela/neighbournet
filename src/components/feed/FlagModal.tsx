import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Check } from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';

interface FlagModalProps {
  incidentId: string | null;
  onClose: () => void;
}

export const FlagModal: React.FC<FlagModalProps> = ({ incidentId, onClose }) => {
  const { flagIncident } = useIncidents();
  const [reason, setReason] = useState('Already resolved / Not there');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!incidentId) return null;

  const flagReasons = [
    'Already resolved / Hazard no longer exists',
    'Incorrect or misleading location',
    'Fabricated / Fake report',
    'Spam or duplicate advertisement',
    'Inappropriate language or photo'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    flagIncident(incidentId, `${reason}: ${notes}`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[2050] flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md select-none">
      <div className="w-full max-w-md bg-charcoal-900 border border-charcoal-750 rounded-3xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-750">
          <div className="flex items-center gap-2 text-rose-400">
            <Flag className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-white">Flag Misleading Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-lavender-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-white">Flag Submitted to Moderators</p>
            <p className="text-xs text-lavender-400">
              Thank you for keeping our community safety network accurate and trustworthy.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <p className="text-xs text-lavender-300">
              Please specify why this incident report should be reviewed by moderators:
            </p>

            <div className="space-y-2">
              {flagReasons.map(r => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    reason === r
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 font-bold'
                      : 'bg-charcoal-850 border-charcoal-750 text-lavender-300 hover:bg-charcoal-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="flagReason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-rose-500"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional details (optional)..."
              className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 focus:border-rose-500 focus:outline-none text-xs text-white placeholder-lavender-500/80 resize-none transition-colors"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-charcoal-800 text-lavender-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-colors"
              >
                Submit Report Flag
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
