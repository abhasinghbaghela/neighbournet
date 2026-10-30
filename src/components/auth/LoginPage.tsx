import React, { useState } from 'react';
import {
  Shield,
  User,
  Mail,
  Building,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  ShieldAlert,
  Award,
  Loader2,
  X,
  Users,
  Building2,
  Wrench,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleOption {
  role: UserRole;
  title: string;
  badge: string;
  dashboardName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  features: string[];
}

export const LoginPage: React.FC = () => {
  const { loginWithNameAndGmail, signInGoogle } = useAuth();

  const [role, setRole] = useState<UserRole>('resident');
  const [name, setName] = useState('');
  const [gmail, setGmail] = useState('');
  const [ward, setWard] = useState('Ward 14 (Greenwood Heights)');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google Account Chooser Modal state
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const roleOptions: RoleOption[] = [
    {
      role: 'resident',
      title: 'Resident Citizen',
      badge: 'Public Member',
      dashboardName: 'Resident Quorum Dashboard',
      icon: Users,
      description: 'Report local hazards, upvote quorum alerts within 150m, and track community health.',
      features: ['1-Click Hazard Reporting', '150m Consensus Quorum', 'Live Community Map']
    },
    {
      role: 'authority',
      title: 'Municipal Officer',
      badge: 'Civic Field Force',
      dashboardName: 'Municipal SLA & Dispatch Console',
      icon: Building2,
      description: 'Monitor active SLA countdowns, dispatch BWSSB / BESCOM crews, and submit photo resolution proof.',
      features: ['SLA Countdown Timers', 'Agency Crew Dispatch', 'Resolution Photo Verification']
    },
    {
      role: 'volunteer',
      title: 'Community Volunteer',
      badge: 'Sentinel Moderator',
      dashboardName: 'Volunteer Sentinel Desk',
      icon: Award,
      description: 'Accelerate consensus with 2.5x voting power, resolve disputes, and maintain verification hygiene.',
      features: ['2.5x Consensus Weight', 'Dispute Arbitration Desk', '+25 Karma Rewards']
    },
    {
      role: 'admin',
      title: 'Society / Authority Admin',
      badge: 'Ward Governance',
      dashboardName: 'Society & Ward Admin Center',
      icon: Shield,
      description: 'Approve new residents, broadcast emergency sirens, audit logs, and export society governance CSVs.',
      features: ['Resident Approval Queue', 'Emergency Siren Broadcast', 'Society Health Analytics']
    }
  ];

  const selectedRoleOption = roleOptions.find(r => r.role === role) || roleOptions[0];

  const googleAccounts = [
    {
      name: 'Arvind Kumar',
      email: 'arvind.k@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      defaultRole: 'resident' as UserRole,
      badge: 'Verified Resident (Ward 14)'
    },
    {
      name: 'Eng. Rajesh M.',
      email: 'rajesh.bwssb@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      defaultRole: 'authority' as UserRole,
      badge: 'Municipal Field Engineer (BWSSB)'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sentinel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      defaultRole: 'volunteer' as UserRole,
      badge: 'Community Sentinel (Volunteer)'
    },
    {
      name: 'Silver Admin',
      email: 'silver.admin@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      defaultRole: 'admin' as UserRole,
      badge: 'Society Administrator (Ward 14)'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!gmail.trim() || !gmail.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      loginWithNameAndGmail(name, gmail, role, ward);
      setIsSubmitting(false);
    }, 300);
  };

  const handleGoogleClick = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const res = await signInGoogle(role, ward);
      if (res.success) {
        setIsGoogleLoading(false);
        return;
      }
      setIsGoogleLoading(false);
      setShowGoogleChooser(true);
    } catch (err: any) {
      setIsGoogleLoading(false);
      setShowGoogleChooser(true);
    }
  };

  const selectGoogleAccount = (acc: typeof googleAccounts[0]) => {
    // If user explicitly picked a role on the login screen, honor that role, else use account's role
    const effectiveRole = role || acc.defaultRole;
    loginWithNameAndGmail(acc.name, acc.email, effectiveRole, ward);
    setShowGoogleChooser(false);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
      setError('Please provide a valid Gmail address.');
      return;
    }
    const derivedName = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    loginWithNameAndGmail(derivedName, customGoogleEmail, role, ward);
    setShowGoogleChooser(false);
  };

  const handleQuickDemoLogin = (demoName: string, demoGmail: string, demoRole: UserRole) => {
    setName(demoName);
    setGmail(demoGmail);
    setRole(demoRole);
    loginWithNameAndGmail(demoName, demoGmail, demoRole, ward);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#090d13] flex flex-col justify-center items-center p-3 sm:p-6 select-none relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pine-800/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Container */}
      <div className="w-full max-w-2xl bg-white dark:bg-charcoal-900 rounded-3xl border border-slate-200/90 dark:border-charcoal-750 shadow-2xl p-5 sm:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* CivicQuest Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-pine-800 text-white mx-auto flex items-center justify-center shadow-md">
            <Shield className="w-7 h-7 fill-current/20 text-white" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 leading-tight">
              <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">
                CivicQuest
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono font-bold tracking-widest uppercase mt-0.5">
              SAFETY GRID V2.4 • HYPERLOCAL CITIZEN PORTAL
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed pt-1">
            Welcome to your neighborhood safety network. Choose your civic role to enter the tailored community dashboard.
          </p>
        </div>

        {/* STEP 1: Interactive Role Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pine-800 text-white text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Select Your Civic Role
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-pine-800 dark:text-pine-400">
              Adapts Dashboard View
            </span>
          </div>

          {/* 4 Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {roleOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = role === opt.role;

              return (
                <div
                  key={opt.role}
                  onClick={() => setRole(opt.role)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left relative ${
                    isSelected
                      ? 'border-pine-800 dark:border-pine-400 bg-pine-50/70 dark:bg-pine-950/40 shadow-sm ring-2 ring-pine-800/20 dark:ring-pine-400/20'
                      : 'border-slate-200 dark:border-charcoal-700 hover:border-slate-300 dark:hover:border-charcoal-600 bg-slate-50/50 dark:bg-charcoal-800/50 hover:bg-slate-50 dark:hover:bg-charcoal-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-pine-800 text-white'
                            : 'bg-slate-200/80 dark:bg-charcoal-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                          {opt.title}
                        </h3>
                        <span className="text-[10px] font-bold text-pine-800 dark:text-pine-400 uppercase tracking-wide">
                          {opt.badge}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-pine-800 bg-pine-800 text-white'
                          : 'border-slate-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-700'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-snug line-clamp-2">
                    {opt.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-charcoal-700/50 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Target Screen:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate ml-1">
                      {opt.dashboardName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Authenticate with Selected Role */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-charcoal-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pine-800 text-white text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Sign In as <span className="text-pine-800 dark:text-pine-400">{selectedRoleOption.title}</span>
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-pine-100 dark:bg-pine-950/60 text-pine-800 dark:text-pine-300 font-bold uppercase tracking-wider">
              {ward.split('(')[0].trim()}
            </span>
          </div>

          {/* Validation error */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-in fade-in">
              {error}
            </div>
          )}

          {/* Google Gmail Sign-In Button with explicitly chosen Role */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-charcoal-700 hover:bg-slate-50 dark:hover:bg-charcoal-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95 group"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-pine-800" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {isGoogleLoading
                ? 'Connecting to Google...'
                : `Sign in with Gmail as ${selectedRoleOption.title}`}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-charcoal-750 w-full" />
            <span className="bg-white dark:bg-charcoal-900 px-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider relative">
              or enter credentials
            </span>
          </div>

          {/* Form: Name & Gmail inputs */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Full Name</span>
                  <span className="text-[10px] text-slate-400">Required</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Arvind Kumar"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50/60 dark:bg-charcoal-800 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 dark:text-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Gmail / Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Gmail / Email</span>
                  <span className="text-[10px] text-slate-400">Required</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={gmail}
                    onChange={e => setGmail(e.target.value)}
                    placeholder="e.g. arvind.k@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50/60 dark:bg-charcoal-800 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 dark:text-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Society Ward Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Housing Society / Ward Jurisdiction</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● Active Grid</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={ward}
                  onChange={e => setWard(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50/60 dark:bg-charcoal-800 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 dark:text-white"
                >
                  <option value="Ward 14 (Greenwood Heights)">Ward 14 (Greenwood Heights / Sector 4)</option>
                  <option value="Ward 112 (Indiranagar / Defence Colony)">Ward 112 (Indiranagar / Defence Colony)</option>
                  <option value="Ward 88 (Koramangala 4th Block)">Ward 88 (Koramangala 4th Block)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-pine-800 hover:bg-pine-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Enter {selectedRoleOption.dashboardName}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Demo 1-Click Persona Logins */}
        <div className="pt-2 border-t border-slate-100 dark:border-charcoal-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              1-Click Demo Personas (Instant Role Testing)
            </span>
            <span className="text-[10px] text-pine-800 dark:text-pine-400 font-semibold">
              Instant Login
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Arvind K.', 'arvind.k@gmail.com', 'resident')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-pine-50 hover:border-pine-300 dark:hover:bg-pine-950/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pine-800 dark:text-pine-400" />
                <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 truncate group-hover:text-pine-800">
                  Arvind K.
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 truncate">Resident Citizen</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Eng. Rajesh M.', 'rajesh.bwssb@gmail.com', 'authority')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-pine-50 hover:border-pine-300 dark:hover:bg-pine-950/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 truncate group-hover:text-pine-800">
                  Officer Rajesh
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 truncate">Municipal Officer</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Priya Sharma', 'priya.sentinel@gmail.com', 'volunteer')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-pine-50 hover:border-pine-300 dark:hover:bg-pine-950/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 truncate group-hover:text-pine-800">
                  Priya Sharma
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 truncate">Community Volunteer</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Silver Admin', 'silver.admin@gmail.com', 'admin')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-pine-50 hover:border-pine-300 dark:hover:bg-pine-950/40 text-left transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 truncate group-hover:text-pine-800">
                  Silver Admin
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 truncate">Society Admin</p>
            </button>
          </div>
        </div>
      </div>

      {/* Google Account Selector Modal (Fallback) */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-charcoal-900 rounded-3xl border border-slate-200 dark:border-charcoal-750 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-charcoal-800 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Sign in with Google as {selectedRoleOption.title}
                </h3>
              </div>
              <button
                onClick={() => setShowGoogleChooser(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an account to enter the <span className="font-bold text-pine-800 dark:text-pine-400">{selectedRoleOption.dashboardName}</span>:
            </p>

            {/* List of Google Accounts */}
            <div className="space-y-2">
              {googleAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => selectGoogleAccount(acc)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-charcoal-700 bg-slate-50/70 dark:bg-charcoal-800 hover:bg-pine-50 hover:border-pine-400 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-pine-800">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {acc.email}
                      </p>
                      <p className="text-[9px] text-pine-800 dark:text-pine-400 font-bold mt-0.5">
                        {acc.badge}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-pine-800 font-bold px-2 py-0.5 rounded-full bg-pine-100">
                    Sign In
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Gmail Form */}
            <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-slate-100 dark:border-charcoal-800 space-y-2">
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Or enter another Gmail address:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-pine-800"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-pine-800 text-white font-bold text-xs hover:bg-pine-900"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-4 text-center text-xs text-slate-400">
        CivicQuest Safety Grid • Role-Based Civic Technology Platform
      </div>
    </div>
  );
};
