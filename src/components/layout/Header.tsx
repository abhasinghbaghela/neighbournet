import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Shield,
  ChevronDown,
  Languages,
  AlertTriangle,
  Building,
  Search,
  Plus,
  Moon,
  Sun,
  User,
  LogOut,
  Radio,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIncidents } from '../../context/IncidentContext';
import { useI18n } from '../../context/I18nContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenReportModal: () => void;
  onOpenSosModal: () => void;
  onOpenNotifications: () => void;
  onStartDemoTour: () => void;
  onSearchChange?: (query: string) => void;
  onAlertClick?: () => void;
}

export default function Header({
  onMenuClick,
  onOpenReportModal,
  onOpenSosModal,
  onOpenNotifications,
  onStartDemoTour,
  onSearchChange,
  onAlertClick
}: HeaderProps) {
  const { user, setRole, signOut, signInGoogle, isAnonymous } = useAuth();
  const { unreadNotificationCount, isOnline } = useIncidents();
  const { lang, setLang, t } = useI18n();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedWard, setSelectedWard] = useState('Ward 14');

  const wards = [
    { id: 'ward-14', name: 'Ward 14', sub: 'Greenwood Heights / Sector 4' },
    { id: 'ward-112', name: 'Ward 112', sub: 'Indiranagar / Defence Colony' },
    { id: 'ward-88', name: 'Ward 88', sub: 'Koramangala 4th Block' }
  ];

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'resident', label: 'Resident Citizen', desc: 'Report issues & verify local safety' },
    { role: 'volunteer', label: 'Community Volunteer', desc: 'Moderate reports & assist consensus' },
    { role: 'authority', label: 'Municipal Officer', desc: 'Update tickets & dispatch field crews' },
    { role: 'admin', label: 'Society / Authority Admin', desc: 'Full civic analytics, health & review' }
  ];

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header className="layout-header bg-white dark:bg-charcoal-900 border-b border-slate-200 dark:border-charcoal-750 px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Left: Mobile hamburger + CivicQuest Logo & Ward Badge */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* CivicQuest Brand Logo (Matches Screenshot 1 & 2) */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pine-800 text-white flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 fill-current/20 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                CivicQuest
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold tracking-widest uppercase">
              SAFETY GRID V2.4
            </p>
          </div>
        </div>

        {/* Ward Selector Button (Matches Screenshot: [🏢 Ward 14]) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-slate-100 dark:hover:bg-charcoal-750 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-pine-800 dark:text-pine-400" />
            <span>{selectedWard}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isWardDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-charcoal-800">
                Select Housing Ward / Society
              </div>
              {wards.map(w => (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelectedWard(w.name);
                    setIsWardDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 dark:hover:bg-charcoal-800 transition-colors ${
                    selectedWard === w.name ? 'bg-pine-50 dark:bg-pine-950/40 text-pine-800 dark:text-pine-300 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{w.name}</span>
                  <span className="text-[10px] text-slate-400">{w.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Live Urgent Alert Ticker (Matches Screenshot 1 & 2 Pink Alert Pill) */}
      <div className="hidden lg:flex items-center flex-1 max-w-xl mx-2">
        <div
          onClick={onAlertClick}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs cursor-pointer hover:bg-rose-100/80 transition-colors"
        >
          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] tracking-wider uppercase flex-shrink-0">
            ALERT
          </span>
          <span className="truncate font-medium text-[11px] sm:text-xs">
            Water Main Burst on 4th Cross — BWSSB crew on site • Isolation active
          </span>
          <span className="ml-auto font-bold underline text-rose-700 dark:text-rose-400 hover:text-rose-900 text-xs flex-shrink-0">
            View
          </span>
        </div>
      </div>

      {/* Right: Search, + Report Issue Button, Language, Bell, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Search Input (Matches Screenshot: Search Incidents...) */}
        <div className="relative hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search Incidents..."
            className="w-36 md:w-52 pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 focus:bg-white dark:focus:bg-charcoal-900 focus:border-pine-800 focus:outline-none dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Primary Action Button: [+ Report Issue] (Matches Screenshot: Deep Pine Green) */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pine-800 hover:bg-pine-900 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Report Issue</span>
        </button>

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSosModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all animate-pulse-subtle"
          title="Broadcast Emergency SOS"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SOS</span>
        </button>

        {/* Language Toggle (EN / HI) */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="p-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-slate-100 dark:hover:bg-charcoal-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          title="Toggle English / Hindi"
        >
          {lang === 'en' ? 'हिं' : 'EN'}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-slate-100 dark:hover:bg-charcoal-750 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Bell with unread badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-slate-100 dark:hover:bg-charcoal-750 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-charcoal-900" />
          )}
        </button>

        {/* User Role Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-pine-50 dark:bg-pine-950/40 border border-pine-200/80 dark:border-pine-800 text-[10px] font-extrabold text-pine-900 dark:text-pine-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="capitalize">
            {user.role === 'authority' ? 'Municipal Officer' : user.role === 'volunteer' ? 'Sentinel Volunteer' : user.role === 'admin' ? 'Society Admin' : 'Resident Citizen'}
          </span>
        </div>

        {/* User Profile Avatar Circle (Matches Screenshot 1 Avatar) */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 p-0.5 rounded-full ring-1 ring-slate-200 dark:ring-charcoal-700 hover:ring-pine-800 transition-all"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-charcoal-800">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.email || 'Resident Account'}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800">
                    🏆 {user.xp} Karma • Rank #4
                  </span>
                </div>
              </div>

              {/* User Role & Jurisdiction Card */}
              <div className="p-2 space-y-1 bg-slate-50 dark:bg-charcoal-800/60 rounded-xl my-1 border border-slate-100 dark:border-charcoal-750">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Security Role</span>
                  <span className="font-black text-pine-800 dark:text-pine-400 capitalize">
                    {user.role === 'authority' ? 'Municipal Officer' : user.role === 'volunteer' ? 'Community Sentinel' : user.role === 'admin' ? 'Society Admin' : 'Resident Citizen'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Jurisdiction</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {user.neighbourhood ? user.neighbourhood.split('(')[0].trim() : 'Ward 14'}
                  </span>
                </div>
              </div>

              {/* Demo Tour Button */}
              <div className="pt-1 border-t border-slate-100 dark:border-charcoal-800">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    onStartDemoTour();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-pine-800 dark:text-pine-400 hover:bg-pine-50 dark:hover:bg-pine-950/40 flex items-center gap-2 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Guided Walkthrough</span>
                </button>

                <button
                  onClick={() => {
                    signOut();
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
