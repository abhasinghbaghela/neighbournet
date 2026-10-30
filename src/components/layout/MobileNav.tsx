import React from 'react';
import { Home, Map, Plus, CheckSquare, Activity } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal
}) => {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-charcoal-750 px-3 py-1.5 select-none shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center p-1.5 transition-colors ${
            activeTab === 'home' ? 'text-pine-800 dark:text-pine-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center p-1.5 transition-colors ${
            activeTab === 'map' ? 'text-pine-800 dark:text-pine-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        {/* Center Report Action Button in Pine Teal */}
        <button
          onClick={onOpenReportModal}
          className="flex flex-col items-center -mt-5 p-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-pine-800 flex items-center justify-center text-white shadow-md border-2 border-white dark:border-charcoal-900 group-active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[10px] text-pine-800 dark:text-pine-400 font-bold mt-0.5">Report</span>
        </button>

        <button
          onClick={() => setActiveTab('verify')}
          className={`flex flex-col items-center p-1.5 transition-colors ${
            activeTab === 'verify' ? 'text-pine-800 dark:text-pine-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Verify</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex flex-col items-center p-1.5 transition-colors ${
            activeTab === 'health' ? 'text-pine-800 dark:text-pine-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Health</span>
        </button>
      </div>
    </nav>
  );
};
