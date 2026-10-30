import React, { useState } from 'react';
import { X } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenSosModal: () => void;
  onOpenNotifications: () => void;
  onStartDemoTour: () => void;
}

export default function Layout({
  children,
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenSosModal,
  onOpenNotifications,
  onStartDemoTour
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="layout-root">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Top Header */}
      <Header
        onMenuClick={() => setMobileMenuOpen(true)}
        onOpenReportModal={onOpenReportModal}
        onOpenSosModal={onOpenSosModal}
        onOpenNotifications={onOpenNotifications}
        onStartDemoTour={onStartDemoTour}
        onAlertClick={() => setActiveTab('home')}
      />

      {/* Body: Sidebar + Main Content */}
      <div className="layout-body">
        {/* Left Sidebar (Desktop Fixed / Mobile Slide-in Drawer) */}
        <aside className={`sidebar-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Drawer Header */}
          <div className="lg:hidden flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-charcoal-750 bg-white dark:bg-charcoal-900">
            <span className="font-extrabold text-xs tracking-wider uppercase text-pine-800 dark:text-pine-400">
              CivicQuest Navigation
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenReportModal={onOpenReportModal}
            onOpenSosModal={onOpenSosModal}
            onItemClick={() => setMobileMenuOpen(false)}
          />
        </aside>

        {/* Main Content Area with Custom Scrollbar */}
        <main className="layout-content custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
