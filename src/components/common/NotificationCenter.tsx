import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  ShieldCheck,
  Users,
  MapPin,
  Flame,
  Volume2
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { SmartNotification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIncident?: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onSelectIncident
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount
  } = useIncidents();
  const { user, updateNotificationSettings } = useAuth();

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateNotificationSettings(user.notificationRadiusKm, true);
        alert('Browser push notifications enabled! You will receive instant safety alerts.');
      }
    }
  };

  const getNotifIcon = (type: SmartNotification['type'], severity: string) => {
    switch (type) {
      case 'emergency_sos':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'incident_resolved':
        return <CheckCheck className="w-4 h-4 text-emerald-600" />;
      case 'duplicate_detected':
        return <Users className="w-4 h-4 text-pine-800 dark:text-pine-400" />;
      case 'incident_verified':
        return <ShieldCheck className="w-4 h-4 text-pine-800 dark:text-pine-400" />;
      default:
        return severity === 'Critical' ? (
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        ) : (
          <Bell className="w-4 h-4 text-amber-500" />
        );
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-charcoal-900 border-l border-slate-200 dark:border-charcoal-750 shadow-2xl p-5 flex flex-col justify-between text-slate-900 dark:text-white animate-in slide-in-from-right duration-200 select-none">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-charcoal-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-pine-800 dark:text-pine-400" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Ward 14 Safety Alerts</h2>
            {unreadNotificationCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                {unreadNotificationCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission CTA */}
        {!user.pushEnabled && (
          <div className="p-3 rounded-2xl bg-pine-50 dark:bg-pine-950/40 border border-pine-200 dark:border-pine-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-pine-800 dark:text-pine-400 flex-shrink-0" />
              <span className="text-[11px] text-pine-950 dark:text-pine-200 font-medium">Enable real-time push alerts?</span>
            </div>
            <button
              onClick={handleRequestPush}
              className="px-2.5 py-1 rounded-lg bg-pine-800 hover:bg-pine-900 text-white font-bold text-[10px] whitespace-nowrap"
            >
              Allow
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <span>No active alerts in Ward 14</span>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (onSelectIncident && notif.incidentId) {
                    onSelectIncident(notif.incidentId);
                  }
                }}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  notif.isRead
                    ? 'bg-slate-50 dark:bg-charcoal-850/60 border-slate-100 dark:border-charcoal-800 text-slate-500 dark:text-slate-400'
                    : 'bg-white dark:bg-charcoal-800 border-pine-200 dark:border-pine-800/60 text-slate-900 dark:text-white shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getNotifIcon(notif.type, notif.severity)}</div>
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-xs">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{notif.body}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-charcoal-800">
        <button
          onClick={markAllNotificationsAsRead}
          className="w-full py-2 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-slate-200 dark:hover:bg-charcoal-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>
    </div>
  );
};
