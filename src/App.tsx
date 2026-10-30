import React, { useState } from 'react';
import { I18nProvider } from './context/I18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IncidentProvider } from './context/IncidentContext';

import Layout from './components/layout/Layout';
import { MobileNav } from './components/layout/MobileNav';
import { HomeView } from './components/home/HomeView';
import { InteractiveMap } from './components/map/InteractiveMap';
import { CommunityVerificationView } from './components/verification/CommunityVerificationView';
import { DuplicateClusteringView } from './components/clustering/DuplicateClusteringView';
import { HealthScoreView } from './components/health/HealthScoreView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LeaderboardView } from './components/gamification/LeaderboardView';
import { LoginPage } from './components/auth/LoginPage';

import { ReportModal } from './components/reporting/ReportModal';
import { NotificationCenter } from './components/common/NotificationCenter';
import { EmergencySOSModal } from './components/common/EmergencySOSModal';
import { HackathonDemoTour } from './components/demo/HackathonDemoTour';
import { IncidentDossierModal } from './components/feed/IncidentDossierModal';
import { Incident } from './types';

const MainLayout: React.FC = () => {
  const { celebrationModal, closeCelebrationModal, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [selectedIncidentForDossier, setSelectedIncidentForDossier] = useState<Incident | null>(null);

  // If not authenticated, render Login Page asking for Gmail & Name
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenReportModal={() => setIsReportModalOpen(true)}
      onOpenSosModal={() => setIsSosModalOpen(true)}
      onOpenNotifications={() => setIsNotificationsOpen(true)}
      onStartDemoTour={() => setIsDemoTourOpen(true)}
    >
      {/* Dynamic View rendering inside Layout Content */}
      {activeTab === 'home' && (
        <HomeView
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenSosModal={() => setIsSosModalOpen(true)}
          onStartDemoTour={() => setIsDemoTourOpen(true)}
          setActiveTab={setActiveTab}
          onSelectIncident={inc => setSelectedIncidentForDossier(inc)}
        />
      )}

      {activeTab === 'map' && (
        <InteractiveMap
          onSelectIncident={inc => setSelectedIncidentForDossier(inc)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      )}

      {activeTab === 'verify' && (
        <CommunityVerificationView
          onSelectIncident={inc => setSelectedIncidentForDossier(inc)}
        />
      )}

      {activeTab === 'clusters' && (
        <DuplicateClusteringView
          onSelectIncident={inc => setSelectedIncidentForDossier(inc)}
        />
      )}

      {activeTab === 'health' && <HealthScoreView />}

      {activeTab === 'admin' && <AdminDashboard />}

      {activeTab === 'notifications' && (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Ward 14 Notifications</h1>
            <p className="text-xs text-slate-500">Live priority alerts, verification updates, and municipal dispatch broadcasts.</p>
          </div>
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl p-6 border border-slate-200 dark:border-charcoal-750 shadow-civic-sm space-y-3">
            {[
              {
                title: 'Water Main Burst on 4th Cross — BWSSB crew on site',
                time: '10m ago',
                desc: 'BWSSB Rapid Unit #3 isolated main valve. Excavation crew working on 12-inch water conduit.',
                type: 'urgent'
              },
              {
                title: 'BESCOM Emergency Unit Dispatched to Defence Colony',
                time: '35m ago',
                desc: 'Feeder line 3 circuit breaker remotely isolated. Cable hazard contained.',
                type: 'dispatch'
              },
              {
                title: 'Community Quorum Achieved for Arterial Pothole',
                time: '2h ago',
                desc: '5 verified residents co-signed hazard location on 100ft Road. Dispatched to PWD.',
                type: 'quorum'
              }
            ].map((n, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800 border border-slate-100 dark:border-charcoal-700 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && <LeaderboardView />}

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Modals & Overlays */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectIncident={id => {
          setIsNotificationsOpen(false);
          setActiveTab('home');
        }}
      />

      <EmergencySOSModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      <HackathonDemoTour
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Incident Full Dossier Modal */}
      <IncidentDossierModal
        incident={selectedIncidentForDossier}
        isOpen={Boolean(selectedIncidentForDossier)}
        onClose={() => setSelectedIncidentForDossier(null)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Celebration Modal */}
      {celebrationModal && celebrationModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-charcoal-900 border-2 border-pine-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-pine-50 dark:bg-pine-950/40 border border-pine-200 mx-auto flex items-center justify-center text-3xl">
              🎉
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {celebrationModal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {celebrationModal.message}
              </p>
            </div>
            {celebrationModal.badge && (
              <div className="p-3 rounded-2xl bg-pine-50 dark:bg-pine-950/40 border border-pine-200 text-xs font-bold text-pine-900 dark:text-pine-200">
                🎖️ Badge Awarded: {celebrationModal.badge}
              </div>
            )}
            <button
              onClick={closeCelebrationModal}
              className="w-full py-2.5 rounded-xl bg-pine-800 hover:bg-pine-900 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Continue Making Community Safer
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <IncidentProvider>
        <I18nProvider>
          <MainLayout />
        </I18nProvider>
      </IncidentProvider>
    </AuthProvider>
  );
}
export default App;
