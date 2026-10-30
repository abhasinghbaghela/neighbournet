import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, SmartNotification, Severity, IncidentStatus } from '../types';
import { INITIAL_INCIDENTS } from '../services/mockData';
import { detectDuplicate, calculateDistanceMeters } from '../services/duplicateDetector';
import { getOfflineQueue, removeOfflineReport } from '../services/offlineStorage';
import {
  subscribeToFirestoreIncidents,
  saveIncidentToFirestore,
  updateIncidentInFirestore,
  seedFirestoreIfEmpty,
  isFirebaseInitialized
} from '../services/firebase';
import { backendApi } from '../services/api';
import { useAuth } from './AuthContext';

interface IncidentContextType {
  incidents: Incident[];
  notifications: SmartNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  createIncident: (report: Partial<Incident>) => { incident: Incident; duplicateMatch?: any };
  verifyIncident: (incidentId: string, isConfirm: boolean) => boolean;
  flagIncident: (incidentId: string, reason: string) => void;
  assignIncidentDepartment: (incidentId: string, department: string) => void;
  updateIncidentStatus: (
    incidentId: string,
    status: IncidentStatus,
    notes?: string,
    proofUrl?: string
  ) => void;
  mergeDuplicateIncidents: (parentIncidentId: string, duplicateIncidentId: string) => void;
  dismissDuplicateCluster: (incidentId: string) => void;
  triggerEmergencySos: (details: { lat: number; lng: number; type: string }) => void;
  isOnline: boolean;
  isFirebaseConnected: boolean;
  isBackendConnected: boolean;
  selectedIncident: Incident | null;
  setSelectedIncident: (inc: Incident | null) => void;
  activeFilterCategory: string;
  setActiveFilterCategory: (cat: string) => void;
  activeFilterSeverity: string;
  setActiveFilterSeverity: (sev: string) => void;
  activeFilterStatus: string;
  setActiveFilterStatus: (stat: string) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, awardXp } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('neighbournet_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(isFirebaseInitialized);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Check Backend Server Health
  useEffect(() => {
    backendApi.getHealth().then(health => {
      if (health && health.status === 'online') {
        setIsBackendConnected(true);
        console.log('✅ Connected to NeighbourNet Express Backend Server (Port 5000)');
      }
    });
  }, []);

  const [notifications, setNotifications] = useState<SmartNotification[]>(() => {
    const saved = localStorage.getItem('neighbournet_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-init-1',
        title: 'High Severity Road Hazard Near You',
        message: 'Severe pothole reported on 100ft Road (approx 450m away). Take caution.',
        severity: 'High',
        incidentId: 'inc-101',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        isRead: false,
        type: 'incident_reported',
        distanceKm: 0.45
      },
      {
        id: 'notif-init-2',
        title: 'Hazard Resolved in Your Neighbourhood',
        message: 'Fallen tree branch on Old Airport feeder road has been cleared by Municipal Forest Wing.',
        severity: 'Low',
        incidentId: 'inc-104',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        isRead: true,
        type: 'incident_resolved',
        distanceKm: 1.1
      }
    ];
  });

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Filters
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('All');
  const [activeFilterSeverity, setActiveFilterSeverity] = useState<string>('All');
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('All');

  useEffect(() => {
    localStorage.setItem('neighbournet_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('neighbournet_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Seed and Subscribe to Real-Time Firebase Cloud Firestore
  useEffect(() => {
    // Attempt seed to Firestore if empty
    seedFirestoreIfEmpty(INITIAL_INCIDENTS);

    // Subscribe to real-time incident changes
    const unsubscribe = subscribeToFirestoreIncidents(
      remoteIncidents => {
        if (remoteIncidents && remoteIncidents.length > 0) {
          setIsFirebaseConnected(true);
          setIncidents(remoteIncidents);
        }
      },
      error => {
        setIsFirebaseConnected(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Online / Offline synchronization
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineReports();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    syncOfflineReports();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sendBrowserPush = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted' && user.pushEnabled) {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.svg'
        });
      } catch (e) {
        console.warn('Browser push notification could not be dispatched:', e);
      }
    }
  };

  const addNotification = (notif: Omit<SmartNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: SmartNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    sendBrowserPush(newNotif.title, newNotif.message);
  };

  const syncOfflineReports = () => {
    const queue = getOfflineQueue();
    if (queue.length > 0) {
      queue.forEach(item => {
        createIncident(item);
        removeOfflineReport(item.id);
      });
      addNotification({
        title: 'Offline Reports Synced',
        message: `Successfully synchronized ${queue.length} offline report(s) with NeighbourNet cloud.`,
        severity: 'Low',
        type: 'incident_reported'
      });
    }
  };

  const createIncident = (report: Partial<Incident>) => {
    const lat = report.location?.lat || 12.9716;
    const lng = report.location?.lng || 77.6413;

    // Check for duplicates across current non-resolved incidents
    let highConfidenceDuplicate: any = null;
    for (const inc of incidents) {
      if (inc.status === 'Resolved') continue;
      const dupResult = detectDuplicate(
        {
          category: report.category || 'Other',
          description: report.description || '',
          lat,
          lng
        },
        inc
      );
      if (dupResult.confidence === 'high' && dupResult.matchScore >= 75) {
        highConfidenceDuplicate = { ...dupResult, parentIncident: inc };
        break;
      }
    }

    const newId = report.id && !report.id.startsWith('offline-') 
      ? report.id 
      : `inc-${Date.now()}`;

    const newIncident: Incident = {
      id: newId,
      title: report.title || `${report.category || 'Civic'} Issue`,
      category: report.category || 'Civic & Infrastructure',
      severity: report.severity || 'Medium',
      description: report.description || '',
      location: {
        lat,
        lng,
        address: report.location?.address || 'Hyperlocal Community Zone',
        neighbourhood: report.location?.neighbourhood || 'Indiranagar',
        ward: report.location?.ward || 'Ward 112'
      },
      imageUrl: report.imageUrl,
      videoUrl: report.videoUrl,
      audioNoteUrl: report.audioNoteUrl,
      status: 'Unverified',
      isAnonymous: report.isAnonymous || false,
      reporterId: report.isAnonymous ? `anon-${Math.random().toString(36).substr(2, 6)}` : user.uid,
      reporterName: report.isAnonymous ? 'Anonymous Resident' : user.name,
      reporterPhoto: report.isAnonymous ? undefined : user.avatar,
      createdAt: report.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: [user.uid],
      disputes: [],
      confirmationsCount: 1,
      disputesCount: 0,
      isFlaggedFalse: false,
      mergedReportsCount: 1,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Incident Submitted',
          description: `${report.isAnonymous ? 'An anonymous resident' : user.name} reported this incident.`,
          actor: report.isAnonymous ? 'Anonymous' : user.name,
          role: user.role,
          actionType: 'report'
        }
      ]
    };

    // If duplicate detected, auto-link to parent incident
    if (highConfidenceDuplicate) {
      const parent = highConfidenceDuplicate.parentIncident as Incident;
      const updatedConfirmations = parent.confirmationsCount + 1;
      const updatedUpvotes = parent.upvotes.includes(user.uid)
        ? parent.upvotes
        : [...parent.upvotes, user.uid];
      const newStatus =
        updatedConfirmations >= 3 && parent.status === 'Unverified'
          ? 'Community Verified'
          : parent.status;

      const parentUpdate: Partial<Incident> = {
        confirmationsCount: updatedConfirmations,
        upvotes: updatedUpvotes,
        status: newStatus,
        mergedReportsCount: parent.mergedReportsCount + 1,
        duplicateGroupMembers: [...(parent.duplicateGroupMembers || []), newId],
        timeline: [
          ...parent.timeline,
          {
            id: `tl-dup-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: 'Duplicate Report Clustered (+1 Confirmation)',
            description: `A concurring report was submitted within ${highConfidenceDuplicate.distanceMeters}m and merged.`,
            actor: user.name,
            role: user.role,
            actionType: 'duplicate_merged'
          }
        ]
      };

      setIncidents(prev =>
        prev.map(item => (item.id === parent.id ? { ...item, ...parentUpdate } : item))
      );

      // Save to Firebase Cloud Firestore
      updateIncidentInFirestore(parent.id, parentUpdate);

      awardXp(100, 'report');

      addNotification({
        title: 'Report Clustered with Active Incident',
        message: `Your report was automatically grouped with existing incident #${parent.id.slice(-4)} (${highConfidenceDuplicate.distanceMeters}m away).`,
        severity: 'Low',
        incidentId: parent.id,
        type: 'duplicate_detected'
      });

      return { incident: newIncident, duplicateMatch: highConfidenceDuplicate };
    }

    // Otherwise add as new standalone incident
    setIncidents(prev => [newIncident, ...prev]);

    // Save to Firebase Cloud Firestore and Backend API
    saveIncidentToFirestore(newIncident);
    backendApi.createIncident(newIncident);

    awardXp(100, 'report');

    // Notify nearby residents within radius
    const userLat = 12.9716;
    const userLng = 77.6413;
    const distMeters = calculateDistanceMeters(userLat, userLng, lat, lng);
    const distKm = Math.round((distMeters / 1000) * 10) / 10;

    if (distKm <= user.notificationRadiusKm) {
      addNotification({
        title: `New ${newIncident.severity} Incident: ${newIncident.category}`,
        message: `${newIncident.title} reported ${distKm}km from your location.`,
        severity: newIncident.severity,
        incidentId: newIncident.id,
        type: 'incident_reported',
        distanceKm: distKm
      });
    }

    return { incident: newIncident };
  };

  const verifyIncident = (incidentId: string, isConfirm: boolean): boolean => {
    let hasVoted = false;
    let updatedPayload: Partial<Incident> | null = null;

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id !== incidentId) return inc;

        const alreadyUpvoted = inc.upvotes.includes(user.uid);
        const alreadyDisputed = inc.disputes.includes(user.uid);

        if (alreadyUpvoted || alreadyDisputed) {
          hasVoted = true;
          return inc; // Prevent double voting
        }

        let updatedUpvotes = [...inc.upvotes];
        let updatedDisputes = [...inc.disputes];
        let newStatus = inc.status;

        if (isConfirm) {
          updatedUpvotes.push(user.uid);
          if (updatedUpvotes.length >= 3 && inc.status === 'Unverified') {
            newStatus = 'Community Verified';
          }
        } else {
          updatedDisputes.push(user.uid);
          if (updatedDisputes.length >= 3) {
            newStatus = 'Disputed';
          }
        }

        const updatedIncident: Incident = {
          ...inc,
          upvotes: updatedUpvotes,
          disputes: updatedDisputes,
          confirmationsCount: updatedUpvotes.length,
          disputesCount: updatedDisputes.length,
          status: newStatus,
          timeline: [
            ...inc.timeline,
            {
              id: `tl-v-${Date.now()}`,
              timestamp: new Date().toISOString(),
              title: isConfirm ? 'Community Confirmation' : 'Dispute Logged',
              description: `${user.name} ${isConfirm ? 'confirmed' : 'disputed'} this incident.`,
              actor: user.name,
              role: user.role,
              actionType: isConfirm ? 'upvote' : 'dispute'
            }
          ]
        };

        updatedPayload = {
          upvotes: updatedUpvotes,
          disputes: updatedDisputes,
          confirmationsCount: updatedUpvotes.length,
          disputesCount: updatedDisputes.length,
          status: newStatus,
          timeline: updatedIncident.timeline
        };

        return updatedIncident;
      })
    );

    if (updatedPayload) {
      updateIncidentInFirestore(incidentId, updatedPayload);
      backendApi.verifyIncident(incidentId, user.uid, isConfirm);
    }

    if (!hasVoted) {
      awardXp(25, 'verify');

      if (isConfirm) {
        addNotification({
          title: 'Verification Recorded (+25 XP)',
          message: 'Thank you for verifying this neighbourhood incident.',
          severity: 'Low',
          incidentId,
          type: 'incident_verified'
        });
      }
      return true;
    }

    return false;
  };

  const flagIncident = (incidentId: string, reason: string) => {
    const inc = incidents.find(i => i.id === incidentId);
    const updatedFlags = [...(inc?.flagReasons || []), reason];

    setIncidents(prev =>
      prev.map(i => {
        if (i.id === incidentId) {
          return {
            ...i,
            isFlaggedFalse: true,
            flagReasons: updatedFlags
          };
        }
        return i;
      })
    );

    updateIncidentInFirestore(incidentId, {
      isFlaggedFalse: true,
      flagReasons: updatedFlags
    });
  };

  const assignIncidentDepartment = (incidentId: string, department: string) => {
    let updatedPayload: Partial<Incident> | null = null;

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          const updatedTimeline = [
            ...inc.timeline,
            {
              id: `tl-a-${Date.now()}`,
              timestamp: new Date().toISOString(),
              title: `Assigned to ${department}`,
              description: `Moderator dispatched ticket to ${department} for on-ground resolution.`,
              actor: user.name,
              role: user.role,
              actionType: 'assign' as const
            }
          ];

          updatedPayload = {
            assignedTo: department,
            assignedAt: new Date().toISOString(),
            status: inc.status === 'Unverified' ? 'Authority Verified' : inc.status,
            timeline: updatedTimeline
          };

          return {
            ...inc,
            ...updatedPayload
          };
        }
        return inc;
      })
    );

    if (updatedPayload) {
      updateIncidentInFirestore(incidentId, updatedPayload);
      backendApi.verifyIncident(incidentId, user.uid, isConfirm);
    }
  };

  const updateIncidentStatus = (
    incidentId: string,
    status: IncidentStatus,
    notes?: string,
    proofUrl?: string
  ) => {
    let updatedPayload: Partial<Incident> | null = null;

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          const isResolved = status === 'Resolved';
          const updatedTimeline = [
            ...inc.timeline,
            {
              id: `tl-s-${Date.now()}`,
              timestamp: new Date().toISOString(),
              title: `Status Changed: ${status}`,
              description: notes ? notes : `Status updated to ${status} by ${user.name}.`,
              actor: user.name,
              role: user.role,
              actionType: isResolved ? ('resolution' as const) : ('status_change' as const)
            }
          ];

          updatedPayload = {
            status,
            updatedAt: new Date().toISOString(),
            resolvedAt: isResolved ? new Date().toISOString() : inc.resolvedAt,
            resolvedBy: isResolved ? user.name : inc.resolvedBy,
            resolutionNotes: notes || inc.resolutionNotes,
            resolutionProofUrl: proofUrl || inc.resolutionProofUrl,
            timeline: updatedTimeline
          };

          return {
            ...inc,
            ...updatedPayload
          };
        }
        return inc;
      })
    );

    if (updatedPayload) {
      updateIncidentInFirestore(incidentId, updatedPayload);
      backendApi.verifyIncident(incidentId, user.uid, isConfirm);
    }

    if (status === 'Resolved') {
      awardXp(50, 'resolve');
      addNotification({
        title: 'Incident Resolved!',
        message: `Incident #${incidentId.slice(-4)} has been verified and marked resolved.`,
        severity: 'Low',
        incidentId,
        type: 'incident_resolved'
      });
    }
  };

  const mergeDuplicateIncidents = (parentIncidentId: string, duplicateIncidentId: string) => {
    const dup = incidents.find(i => i.id === duplicateIncidentId);
    if (!dup) return;

    let updatedParent: Incident | null = null;

    setIncidents(prev =>
      prev
        .filter(i => i.id !== duplicateIncidentId)
        .map(item => {
          if (item.id === parentIncidentId) {
            updatedParent = {
              ...item,
              mergedReportsCount: item.mergedReportsCount + 1,
              confirmationsCount: item.confirmationsCount + 1,
              duplicateGroupMembers: [...(item.duplicateGroupMembers || []), duplicateIncidentId],
              timeline: [
                ...item.timeline,
                {
                  id: `tl-m-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  title: 'Duplicate Report Manually Merged',
                  description: `Incident #${duplicateIncidentId.slice(-4)} was merged into this primary ticket by moderator.`,
                  actor: user.name,
                  role: user.role,
                  actionType: 'duplicate_merged'
                }
              ]
            };
            return updatedParent;
          }
          return item;
        })
    );

    if (updatedParent) {
      updateIncidentInFirestore(parentIncidentId, updatedParent);
    }
  };

  const dismissDuplicateCluster = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(i => {
        if (i.id === incidentId) {
          const updated = {
            ...i,
            mergedReportsCount: 1,
            duplicateGroupMembers: []
          };
          updateIncidentInFirestore(incidentId, updated);
          return updated;
        }
        return i;
      })
    );
  };

  const triggerEmergencySos = (details: { lat: number; lng: number; type: string }) => {
    const newIncident: Incident = {
      id: `sos-${Date.now()}`,
      title: `EMERGENCY SOS: ${details.type.toUpperCase()}`,
      category: 'Fire & Emergencies',
      severity: 'Critical',
      description: `Emergency distress signal triggered at coordinates (${details.lat.toFixed(4)}, ${details.lng.toFixed(4)}). Nearby emergency units & community contacts notified.`,
      location: {
        lat: details.lat,
        lng: details.lng,
        address: 'Emergency Beacon Location',
        neighbourhood: 'Immediate Neighbourhood',
        ward: 'Emergency Ward'
      },
      status: 'Authority Verified',
      isAnonymous: false,
      reporterId: user.uid,
      reporterName: user.name,
      reporterPhoto: user.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: [user.uid],
      disputes: [],
      confirmationsCount: 1,
      disputesCount: 0,
      isFlaggedFalse: false,
      mergedReportsCount: 1,
      assignedTo: 'Emergency Fire & Disaster Response',
      assignedAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl-sos-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: '🚨 EMERGENCY SOS TRIGGERED',
          description: `One-touch SOS beacon broadcasted to municipal emergency services and neighbourhood circle.`,
          actor: user.name,
          role: 'Resident',
          actionType: 'report'
        }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);
    saveIncidentToFirestore(newIncident);

    addNotification({
      title: '🚨 EMERGENCY SOS BROADCAST',
      message: `Critical SOS alert active near your location. Emergency services dispatched.`,
      severity: 'Critical',
      incidentId: newIncident.id,
      type: 'emergency_sos',
      distanceKm: 0.1
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createIncident,
        verifyIncident,
        flagIncident,
        assignIncidentDepartment,
        updateIncidentStatus,
        mergeDuplicateIncidents,
        dismissDuplicateCluster,
        triggerEmergencySos,
        isOnline,
        isFirebaseConnected,
        isBackendConnected,
        selectedIncident,
        setSelectedIncident,
        activeFilterCategory,
        setActiveFilterCategory,
        activeFilterSeverity,
        setActiveFilterSeverity,
        activeFilterStatus,
        setActiveFilterStatus
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) throw new Error('useIncidents must be used within IncidentProvider');
  return context;
};
