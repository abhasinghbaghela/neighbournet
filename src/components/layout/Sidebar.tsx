import React from 'react';
import {
  Home,
  Map,
  AlertTriangle,
  CheckSquare,
  GitFork,
  Activity,
  Shield,
  Bell,
  LogOut,
  Award,
  Layers,
  ArrowRightLeft,
  Building2,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIncidents } from '../../context/IncidentContext';
import { useI18n } from '../../context/I18nContext';
import { UserRole } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenSosModal: () => void;
  onItemClick?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onItemClick
}: SidebarProps) {
  const { user, setRole, signOut } = useAuth();
  const { incidents, unreadNotificationCount } = useIncidents();
  const { t } = useI18n();

  const unverifiedCount = incidents.filter(i => i.status === 'Unverified').length;

  const getRoleDisplayName = () => {
    switch (user.role) {
      case 'authority':
        return 'Municipal Officer';
      case 'volunteer':
        return 'Community Sentinel';
      case 'admin':
        return 'Society Admin';
      default:
        return 'Resident Citizen';
    }
  };

  const getHomeLabel = () => {
    switch (user.role) {
      case 'authority':
        return 'Municipal Officer Console';
      case 'volunteer':
        return 'Volunteer Sentinel Desk';
      case 'admin':
        return 'Society Admin Center';
      default:
        return 'Resident Dashboard';
    }
  };

  const getHomeIcon = () => {
    switch (user.role) {
      case 'authority':
        return Building2;
      case 'volunteer':
        return Award;
      case 'admin':
        return Shield;
      default:
        return Home;
    }
  };

  const navItems = [
    { id: 'home', label: getHomeLabel(), icon: getHomeIcon() },
    { id: 'map', label: 'Live Incident Map', icon: Map },
    { id: 'report', label: 'Report Issue', icon: AlertTriangle },
    { id: 'verify', label: 'Community Verification', icon: CheckSquare, badge: unverifiedCount > 0 ? unverifiedCount : undefined },
    { id: 'clusters', label: 'Duplicate Clustering', icon: GitFork },
    { id: 'health', label: 'Health Score', icon: Activity },
    { id: 'admin', label: 'Authority Admin', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined }
  ];

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'report') {
      onOpenReportModal();
    } else {
      setActiveTab(tabId);
    }
    if (onItemClick) onItemClick();
  };

  const toggleResidentView = () => {
    const rolesOrder: UserRole[] = ['resident', 'volunteer', 'authority', 'admin'];
    const currentIdx = rolesOrder.indexOf(user.role);
    const nextRole = rolesOrder[(currentIdx + 1) % rolesOrder.length];
    setRole(nextRole);
  };

  return (
    <div className="flex flex-col h-full justify-between p-3.5 select-none bg-white dark:bg-charcoal-900 border-r border-slate-200 dark:border-charcoal-750">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Ward / Society Pill (Matches Screenshot 1: Ward 14 • Greenwood  Live) */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-200/80 dark:border-charcoal-700">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              Ward 14 • Greenwood
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
            Live
          </span>
        </div>

        {/* Navigation List (Matches Screenshot 1 exactly) */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-pine-800 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section (Matches Screenshot 1 Bottom Controls) */}
      <div className="pt-3 border-t border-slate-200 dark:border-charcoal-750 space-y-3">
        {/* Switch: Resident View TOGGLE Pill */}
        <button
          onClick={toggleResidentView}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-800 hover:bg-slate-100 dark:hover:bg-charcoal-750 border border-slate-200 dark:border-charcoal-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          title="Switch User Role (Resident, Volunteer, Authority, Admin)"
        >
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-pine-800 dark:text-pine-400" />
            <span className="capitalize">Switch: {user.role} View</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            TOGGLE
          </span>
        </button>

        {/* User Badge: Arvind K. • 485 Karma • Rank #4 (Matches Screenshot 1) */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-200/80 dark:border-charcoal-700">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-pine-800 dark:text-pine-400 font-extrabold truncate">
                {getRoleDisplayName()}
              </p>
              <div className="flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-400 font-bold">
                <Award className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                <span>{user.xp} Karma • Rank #4</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200/50 dark:hover:bg-charcoal-700 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
