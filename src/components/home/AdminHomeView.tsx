import React from 'react';
import { AdminDashboard } from '../admin/AdminDashboard';
import { useAuth } from '../../context/AuthContext';
import { Incident } from '../../types';

interface AdminHomeViewProps {
  onOpenReportModal: () => void;
  setActiveTab: (tab: string) => void;
  onSelectIncident?: (incident: Incident) => void;
}

export const AdminHomeView: React.FC<AdminHomeViewProps> = ({
  onOpenReportModal,
  setActiveTab,
  onSelectIncident
}) => {
  return (
    <div className="animate-in fade-in duration-150">
      <AdminDashboard />
    </div>
  );
};
