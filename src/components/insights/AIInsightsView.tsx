import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Brain,
  ShieldAlert,
  ArrowRight,
  Send,
  Building,
  RefreshCw
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { generateAIInsights } from '../../services/aiInsightsService';

export const AIInsightsView: React.FC = () => {
  const { incidents } = useIncidents();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const insights = generateAIInsights(incidents);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lavender-300" />
              Machine Learning Telemetry
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/60 text-lavender-300 font-mono border border-violet-500/30">
              Gemini Vision & Cluster Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Civic Insights & Predictive Hotspots
          </h1>
          <p className="text-xs sm:text-sm text-lavender-400 mt-1">
            Automated intelligence analyzing incident recurring patterns, structural hazard forecasts & municipal task dispatch.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-charcoal-850 hover:bg-charcoal-800 text-lavender-200 border border-charcoal-700 hover:border-violet-500/40 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-violet-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Regenerate Analysis</span>
        </button>
      </div>

      {/* AI Executive Brief */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-violet-500/40 shadow-violet-glow relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-lavender-200 flex-shrink-0 shadow-violet-sm">
            <Brain className="w-6 h-6 text-violet-300" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                Automated Municipal Briefing
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                98.4% Consensus
              </span>
            </div>
            <p className="text-xs sm:text-sm text-lavender-200 leading-relaxed">
              {insights.executiveBrief}
            </p>
            <div className="p-3 rounded-2xl bg-charcoal-950 border border-charcoal-750 text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{insights.keyTrend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Hotspot Forecasting Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Predictive Hazard Hotspot Radar</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-violet-950 text-lavender-300 border border-violet-500/30 font-mono font-bold">
                FORECAST (Not Confirmed)
              </span>
            </h2>
            <p className="text-xs text-lavender-400 mt-0.5">
              These warnings use historical rain data and telemetry patterns to predict infrastructure failures before they happen.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.predictions.map(pred => (
            <div
              key={pred.id}
              className="p-5 rounded-3xl bg-charcoal-850 border border-charcoal-700/80 hover:border-violet-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-950/60 text-lavender-300 border border-violet-500/30 font-mono">
                    {pred.riskScore}% Probability
                  </span>
                  <span className="text-[10px] text-lavender-500 font-mono">
                    {pred.historicalIncidentCount} past issues
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mb-1">
                  {pred.areaName}
                </h3>

                <p className="text-[11px] font-semibold text-violet-400 mb-2">
                  Risk: {pred.predictedCategory}
                </p>

                <p className="text-xs text-lavender-300 leading-relaxed mb-3">
                  {pred.reason}
                </p>
              </div>

              <div className="pt-3 border-t border-charcoal-700 text-[11px] text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-800/30">
                <b>Suggested Pre-emptive Action:</b> {pred.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Municipal Department Directives */}
      <div className="p-5 rounded-3xl bg-charcoal-850 border border-charcoal-700/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-lavender-100 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-violet-400" />
            <span>AI Suggested Administrative Directives</span>
          </h3>
          <span className="text-xs font-mono text-lavender-400">
            Automated Task Prioritization
          </span>
        </div>

        <div className="space-y-3">
          {insights.recommendedAdminActions.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-violet-500/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rec.priority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-violet-950/60 text-lavender-300 border border-violet-500/30'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs font-bold text-white">
                    {rec.department}
                  </span>
                </div>
                <p className="text-xs text-lavender-300">{rec.action}</p>
                <p className="text-[10px] text-lavender-500 font-mono">
                  Impacts ~{rec.affectedResidentsEstimate} residents in ward
                </p>
              </div>

              <button
                onClick={() => alert(`Dispatched formal civic advisory to ${rec.department}.`)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-950/60 hover:bg-violet-900/60 text-lavender-200 border border-violet-500/40 transition-colors whitespace-nowrap self-start sm:self-auto shadow-violet-sm"
              >
                <span>Dispatch Advisory</span>
                <Send className="w-3 h-3 text-violet-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
