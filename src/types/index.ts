export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentCategory =
  | 'Theft & Security'
  | 'Road Hazards & Potholes'
  | 'Water Leakage & Shortage'
  | 'Electricity & Outages'
  | 'Fire & Emergencies'
  | 'Stray Animals'
  | 'Garbage & Sanitation'
  | 'Civic & Infrastructure';

export type IncidentStatus =
  | 'Unverified'
  | 'Community Verified'
  | 'Authority Verified'
  | 'In Progress'
  | 'Resolved'
  | 'Disputed';

export type UserRole = 'resident' | 'volunteer' | 'admin' | 'authority';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address?: string;
  neighbourhood?: string;
  ward?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  role: string;
  actionType: 'report' | 'upvote' | 'dispute' | 'assign' | 'status_change' | 'resolution' | 'duplicate_merged';
}

export interface DuplicateMatch {
  incidentId: string;
  similarityScore: number; // 0 to 1
  distanceMeters: number;
  reason: string;
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: Severity;
  description: string;
  location: LocationCoordinates;
  imageUrl?: string;
  videoUrl?: string;
  audioNoteUrl?: string;
  status: IncidentStatus;
  isAnonymous: boolean;
  reporterId: string;
  reporterName: string;
  reporterPhoto?: string;
  createdAt: string;
  updatedAt: string;
  
  // Community Verification
  upvotes: string[]; // User IDs who verified / confirmed
  disputes: string[]; // User IDs who disputed
  confirmationsCount: number;
  disputesCount: number;
  isFlaggedFalse: boolean;
  flagReasons?: string[];
  
  // Duplication
  duplicateOf?: string; // Parent incident ID if clustered
  mergedReportsCount: number;
  isClusterParent?: boolean;
  duplicateGroupMembers?: string[];
  
  // Authority assignment
  assignedTo?: string; // e.g. "Municipal Road Works", "BESCOM Electricity Board"
  assignedAt?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionProofUrl?: string;
  
  // Timeline audit
  timeline: TimelineEvent[];
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  xp: number;
  level: number;
  badges: string[];
  reportsSubmitted: number;
  reportsVerified: number;
  neighbourhood: string;
  notificationRadiusKm: number;
  pushEnabled: boolean;
  joinedAt: string;
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  incidentId?: string;
  timestamp: string;
  isRead: boolean;
  type: 'incident_reported' | 'incident_verified' | 'incident_resolved' | 'duplicate_detected' | 'emergency_sos' | 'badge_earned';
  distanceKm?: number;
}

export interface NeighbourhoodHealthMetrics {
  overallScore: number; // 0 to 100
  trend: 'improving' | 'stable' | 'declining';
  trendPercentage: number;
  totalIncidents: number;
  unresolvedCount: number;
  resolvedCount: number;
  resolutionRate: number; // %
  averageResolutionHours: number;
  categoryScores: {
    category: IncidentCategory;
    score: number;
    incidentCount: number;
  }[];
  wardComparisons: {
    ward: string;
    score: number;
    activeCount: number;
  }[];
  historical7Days: {
    day: string;
    score: number;
    resolved: number;
    reported: number;
  }[];
}

export interface AIHotspotPrediction {
  id: string;
  areaName: string;
  lat: number;
  lng: number;
  riskScore: number; // 0 - 100
  predictedCategory: IncidentCategory;
  reason: string;
  recommendation: string;
  historicalIncidentCount: number;
  isPrediction: true;
}
