import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ChevronRight,
  Shield,
  Layers,
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { calculateNeighbourhoodHealth } from '../../services/healthScoreService';

export const HealthScoreView: React.FC = () => {
  const { incidents } = useIncidents();
  const metrics = calculateNeighbourhoodHealth(incidents);
  const [showFormula, setShowFormula] = useState(false);

  // Score color
  const getScoreTheme = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600 dark:text-emerald-400', stroke: '#10b981', badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' };
    if (score >= 60) return { text: 'text-pine-800 dark:text-pine-300', stroke: '#09544c', badge: 'bg-pine-50 text-pine-800 dark:bg-pine-950/60 dark:text-pine-300' };
    if (score >= 45) return { text: 'text-amber-600 dark:text-amber-400', stroke: '#f59e0b', badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' };
    return { text: 'text-rose-600 dark:text-rose-400', stroke: '#ef4444', badge: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' };
  };

  const theme = getScoreTheme(metrics.overallScore);

  // SVG circular dial
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (metrics.overallScore / 100) * circumference;

  // 7-day historical trend data
  const trendHistory = [
    { day: 'Mon', score: 79 },
    { day: 'Tue', score: 81 },
    { day: 'Wed', score: 80 },
    { day: 'Thu', score: 84 },
    { day: 'Fri', score: 83 },
    { day: 'Sat', score: 85 },
    { day: 'Today', score: metrics.overallScore }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pine-800 dark:bg-pine-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pine-800 dark:text-pine-400 font-mono">
              CIVIC METRIC TELEMETRY • WARD 14 (GREENWOOD HEIGHTS)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Neighbourhood Health Score
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Transparent algorithmic rating (0–100) evaluating municipal responsiveness, active hazard severity, and SLA resolution velocity.
          </p>
        </div>

        <button
          onClick={() => setShowFormula(!showFormula)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-pine-800 dark:text-pine-400" />
          <span>Formula Transparency</span>
        </button>
      </div>

      {/* Formula Transparency Popover */}
      {showFormula && (
        <div className="p-5 rounded-2xl bg-pine-50/70 dark:bg-pine-950/40 border border-pine-200 dark:border-pine-800/80 text-xs space-y-2 text-pine-950 dark:text-pine-200 animate-in fade-in duration-150">
          <p className="font-bold text-sm">Transparent Health Score Formula (0 to 100):</p>
          <p className="font-mono bg-white/80 dark:bg-charcoal-900/80 p-2.5 rounded-xl border border-pine-200/50">
            Health Score = 100 - Σ(Severity Penalty) - (Unresolved Age Penalty) + (Resolution Rate Bonus)
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
            <li>Critical Hazard: -14 pts penalty per open report</li>
            <li>High Hazard: -7 pts penalty per open report</li>
            <li>Medium Hazard: -3.5 pts penalty per open report</li>
            <li>Resolved incidents within SLA: +10 pts municipal bonus</li>
          </ul>
        </div>
      )}

      {/* Main Score & Historical Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Radial Dial Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="transparent"
                className="dark:stroke-charcoal-800"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${theme.text}`}>
                {metrics.overallScore}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${theme.badge}`}>
              {metrics.overallScore >= 75 ? 'Healthy & Responsive' : 'Moderate Attention Needed'}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked in top 5% of Bangalore city wards
            </p>
          </div>
        </div>

        {/* Right 2 Columns: 7-Day Trend Chart & Metrics */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                7-Day Health Score Velocity
              </h3>
              <p className="text-xs text-slate-400">
                +4.2% improvement this week due to rapid BWSSB & BESCOM repairs.
              </p>
            </div>

            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>+4.2%</span>
            </div>
          </div>

          {/* SVG Polyline Trend Chart */}
          <div className="h-36 w-full flex items-end justify-between pt-4 pb-2 px-2 border-b border-slate-100 dark:border-charcoal-800">
            {trendHistory.map((pt, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {pt.score}
                </span>
                <div
                  className="w-8 sm:w-12 bg-pine-800/80 dark:bg-pine-500 rounded-t-xl transition-all duration-500 hover:bg-pine-900"
                  style={{ height: `${(pt.score / 100) * 80}px` }}
                />
                <span className="text-[10px] text-slate-400 font-medium">
                  {pt.day}
                </span>
              </div>
            ))}
          </div>

          {/* Sub Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Resolution Rate</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{metrics.resolutionRate}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Resolution Speed</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">4.2 Hours</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Active Backlog</p>
              <p className="text-base font-extrabold text-rose-600 dark:text-rose-400">{incidents.filter(i => i.status !== 'Resolved').length} Tickets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category-Wise Health Breakdown & Actionable Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Category-Wise Health Rating
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Water & Utilities', score: 88, color: 'bg-sky-500' },
              { label: 'Electrical & Lighting', score: 82, color: 'bg-yellow-500' },
              { label: 'Road Hazards & Potholes', score: 74, color: 'bg-amber-500' },
              { label: 'Sanitation & Waste', score: 91, color: 'bg-emerald-500' }
            ].map(cat => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                  <span className="text-slate-900 dark:text-white font-mono">{cat.score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-charcoal-800 overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Municipal Recommendations */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pine-800 dark:text-pine-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Municipal SLA Improvement Insights
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                • 100ft Road Crater Urgent Triage:
              </span>
              Patching the high-severity arterial pothole will boost Ward Health score from 86 to 91 and eliminate commuter rim damage liability.
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                • 5th Cross Luminaire Replacement:
              </span>
              Replacing the dark luminaire will restore night pedestrian visibility on 5th Cross.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
