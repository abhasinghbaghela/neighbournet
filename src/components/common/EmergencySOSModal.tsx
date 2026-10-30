import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  PhoneCall,
  Flame,
  ShieldAlert,
  HeartPulse,
  Radio,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const { triggerEmergencySos } = useIncidents();
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [selectedSosType, setSelectedSosType] = useState('Critical Safety Emergency');

  if (!isOpen) return null;

  const helplines = [
    { title: 'National Emergency', number: '112', icon: ShieldAlert, color: 'text-rose-600', desc: 'Police, Fire, Ambulance unified emergency' },
    { title: 'Medical / Ambulance', number: '108', icon: HeartPulse, color: 'text-red-600', desc: 'Emergency medical paramedic dispatch' },
    { title: 'Fire & Disaster Rescue', number: '101', icon: Flame, color: 'text-orange-600', desc: 'Municipal fire department station' },
    { title: 'Women Safety Helpline', number: '1091', icon: AlertTriangle, color: 'text-purple-600', desc: '24/7 Rapid response women protection cell' }
  ];

  const handleBroadcastBeacon = () => {
    setBroadcastActive(true);
    triggerEmergencySos({
      lat: 12.9716,
      lng: 77.6413,
      type: selectedSosType
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-white dark:bg-charcoal-900 border-2 border-rose-500 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-charcoal-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Emergency SOS & Direct Dispatch
              </h2>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                High-priority distress beacon & official emergency helplines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS One-Touch Broadcast Beacon */}
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3">
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>One-Touch Community Distress Beacon</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Broadcasts immediate emergency location to society administrators, nearby verified residents, and police emergency desk.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>Broadcasting from: Ward 14 (Greenwood Heights, Bangalore)</span>
          </div>

          {broadcastActive ? (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>🚨 DISTRESS BEACON ACTIVE — Emergency team & volunteers alerted!</span>
            </div>
          ) : (
            <button
              onClick={handleBroadcastBeacon}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 stroke-[3]" />
              <span>Broadcast Immediate SOS Beacon</span>
            </button>
          )}
        </div>

        {/* Official Helpline Contacts */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Direct Helpline Contacts (India)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {helplines.map(h => {
              const Icon = h.icon;
              return (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className="p-3 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 hover:bg-slate-50 dark:hover:bg-charcoal-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-charcoal-800 ${h.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{h.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-bold">Call {h.number}</p>
                    </div>
                  </div>
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
