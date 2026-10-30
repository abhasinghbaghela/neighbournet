import React from 'react';
import {
  Trophy,
  Award,
  Shield,
  Star,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LeaderboardView: React.FC = () => {
  const { user, leaderboard } = useAuth();

  const currentLevelXpProgress = user.xp % 150;
  const progressPercent = Math.min(100, Math.round((currentLevelXpProgress / 150) * 100));

  const allBadges = [
    {
      name: 'First Responder',
      desc: 'Submitted your first incident report',
      icon: '🎖️',
      unlocked: user.badges.includes('First Responder')
    },
    {
      name: 'Civic Scout',
      desc: 'Verified 5 neighbourhood hazard reports',
      icon: '🧭',
      unlocked: user.badges.includes('Civic Scout')
    },
    {
      name: 'Eagle Eye',
      desc: 'Provided high-quality photographic evidence',
      icon: '🦅',
      unlocked: user.badges.includes('Eagle Eye')
    },
    {
      name: 'Community Pillar',
      desc: 'Reached Level 4 Citizen Status',
      icon: '🏛️',
      unlocked: user.badges.includes('Community Pillar')
    },
    {
      name: 'Vigilant Guardian',
      desc: '15+ verified confirmations logged',
      icon: '🛡️',
      unlocked: user.badges.includes('Vigilant Guardian')
    },
    {
      name: 'Civic Vanguard',
      desc: 'Submitted 5+ confirmed municipal tickets',
      icon: '⚡',
      unlocked: user.badges.includes('Civic Vanguard')
    }
  ];

  const quests = [
    {
      id: 'q1',
      title: 'Road Hazard Verification',
      desc: 'Verify 2 road hazards or potholes on Indiranagar corridor',
      reward: '+50 Karma',
      progress: '1/2',
      isComplete: false
    },
    {
      id: 'q2',
      title: 'Night Streetlight Audit',
      desc: 'Log or confirm dark street luminaire after 8 PM',
      reward: '+75 Karma',
      progress: 'Completed',
      isComplete: true
    },
    {
      id: 'q3',
      title: 'Water Pipe Burst Rapid Alert',
      desc: 'Report water supply leaks within 15 minutes of occurrence',
      reward: '+100 Karma',
      progress: '1/1',
      isComplete: true
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pine-800 dark:bg-pine-400" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-pine-800 dark:text-pine-400 font-mono">
            CITIZEN CITADEL • REPUTATION & GUARDIAN RANKS
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Ward 14 Community Guardians
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Reputation-weighted civic engagement. High-reputation residents unlock accelerated quorum dispatch and municipal oversight badges.
        </p>
      </div>

      {/* User Karma Status Hero Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 flex items-center justify-center text-3xl">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-pine-50 dark:bg-pine-950 text-pine-800 dark:text-pine-300 text-xs font-bold border border-pine-200">
                Tier II Guardian
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ward 14 • Greenwood Heights • Rank #4
            </p>
          </div>
        </div>

        <div className="sm:text-right space-y-1">
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {user.xp} <span className="text-sm font-bold text-slate-400">Karma</span>
          </p>
          <div className="w-44 h-2 rounded-full bg-slate-100 dark:bg-charcoal-800 overflow-hidden ml-auto">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold">
            {currentLevelXpProgress}/150 Karma to Tier III Vanguard
          </p>
        </div>
      </div>

      {/* Grid: Quests & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Quests & Badges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Quests */}
          <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-pine-800 dark:text-pine-400" />
              <span>Active Community Quests</span>
            </h3>

            <div className="space-y-3">
              {quests.map(q => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-750 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{q.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug">{q.desc}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 block">
                      {q.reward}
                    </span>
                    <span className={`text-[10px] font-bold ${q.isComplete ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {q.progress}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-pine-800 dark:text-pine-400" />
              <span>Guardian Distinction Badges</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allBadges.map(b => (
                <div
                  key={b.name}
                  className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all ${
                    b.unlocked
                      ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-charcoal-800/50 border-slate-100 dark:border-charcoal-750 opacity-50'
                  }`}
                >
                  <span className="text-2xl block">{b.icon}</span>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">{b.name}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ward 14 Top Citizens Leaderboard */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-750 shadow-civic-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Ward 14 Leaderboard</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Monthly</span>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: 'Priya Sharma', karma: 620, badge: 'Tier I Sentinel', medal: '🥇' },
              { rank: 2, name: 'Kavita Rao', karma: 540, badge: 'Tier I Sentinel', medal: '🥈' },
              { rank: 3, name: 'Deepak Mohan', karma: 505, badge: 'Tier II Guardian', medal: '🥉' },
              { rank: 4, name: user.name || 'Arvind K.', karma: user.xp || 485, badge: 'Tier II Guardian', medal: '#4' },
              { rank: 5, name: 'Sneha Reddy', karma: 420, badge: 'Tier II Guardian', medal: '#5' },
              { rank: 6, name: 'Aman Gupta', karma: 390, badge: 'Tier III Citizen', medal: '#6' }
            ].map(citizen => (
              <div
                key={citizen.rank}
                className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-colors ${
                  citizen.rank === 4
                    ? 'bg-pine-50 dark:bg-pine-950/60 border border-pine-200 dark:border-pine-800/80 font-bold'
                    : 'bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-xs w-5 text-center text-slate-500">{citizen.medal}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{citizen.name}</p>
                    <p className="text-[10px] text-slate-400">{citizen.badge}</p>
                  </div>
                </div>

                <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                  {citizen.karma}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
