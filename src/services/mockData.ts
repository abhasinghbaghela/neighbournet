import { Incident, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  uid: 'usr-current-1',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@neighbournet.org',
  role: 'resident',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
  xp: 340,
  level: 3,
  badges: ['First Responder', 'Civic Scout', 'Eagle Eye'],
  reportsSubmitted: 4,
  reportsVerified: 12,
  neighbourhood: 'Indiranagar (Ward 112)',
  notificationRadiusKm: 2.5,
  pushEnabled: true,
  joinedAt: '2026-08-15T10:00:00Z'
};

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-101',
    title: 'Severe Arterial Pothole on 100ft Road',
    category: 'Road Hazards & Potholes',
    severity: 'High',
    description: 'Deep road crater located in the middle commuting lane near 12th Main junction. Two scooters have already suffered rim damage.',
    location: {
      lat: 12.9719,
      lng: 77.6412,
      address: '100ft Road, opposite Toit Brewpub, Indiranagar',
      neighbourhood: 'Indiranagar',
      ward: 'Ward 112'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'Community Verified',
    isAnonymous: false,
    reporterId: 'usr-882',
    reporterName: 'Priya Sharma',
    reporterPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    upvotes: ['usr-101', 'usr-102', 'usr-103', 'usr-104', 'usr-current-1'],
    disputes: [],
    confirmationsCount: 5,
    disputesCount: 0,
    isFlaggedFalse: false,
    mergedReportsCount: 1,
    assignedTo: 'Municipal Road Works (PWD)',
    assignedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't-1',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        title: 'Incident Reported',
        description: 'Priya Sharma reported a high-severity road pothole with photo evidence.',
        actor: 'Priya Sharma',
        role: 'Resident',
        actionType: 'report'
      },
      {
        id: 't-2',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        title: 'Community Verified (Threshold Reached)',
        description: '5 independent residents verified and confirmed the hazard location.',
        actor: 'Neighbourhood Consensus',
        role: 'Community',
        actionType: 'upvote'
      },
      {
        id: 't-3',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        title: 'Dispatched to Municipal PWD',
        description: 'Auto-routed to Municipal Road Works division for patch repair.',
        actor: 'Admin Moderation',
        role: 'Admin',
        actionType: 'assign'
      }
    ]
  },
  {
    id: 'inc-102',
    title: 'Snapping Overhead Electric Cable Dangling Near Footpath',
    category: 'Electricity & Outages',
    severity: 'Critical',
    description: 'Post-rain storm, a heavy insulated cable broke free from transformer bracket and is hanging within 1.6m of children walking path.',
    location: {
      lat: 12.9754,
      lng: 77.6385,
      address: '6th Main Rd, near Defence Colony Playground',
      neighbourhood: 'Defence Colony',
      ward: 'Ward 112'
    },
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    isAnonymous: false,
    reporterId: 'usr-331',
    reporterName: 'Kavita Rao',
    reporterPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    upvotes: ['usr-110', 'usr-111', 'usr-112', 'usr-113', 'usr-114', 'usr-115'],
    disputes: [],
    confirmationsCount: 6,
    disputesCount: 0,
    isFlaggedFalse: false,
    mergedReportsCount: 2,
    assignedTo: 'BESCOM Electricity Board',
    assignedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't-4',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        title: 'Critical Incident Reported',
        description: 'Live electrical cable hazard reported by Kavita Rao.',
        actor: 'Kavita Rao',
        role: 'Resident',
        actionType: 'report'
      },
      {
        id: 't-5',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        title: 'Emergency Priority Escalation',
        description: 'Assigned to BESCOM Fast Response Unit.',
        actor: 'System AI Emergency Router',
        role: 'System',
        actionType: 'assign'
      },
      {
        id: 't-6',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        title: 'Repair Crew on Site',
        description: 'Lineman crew on location; power isolated on sub-feeder line.',
        actor: 'BESCOM Field Officer',
        role: 'Authority',
        actionType: 'status_change'
      }
    ]
  },
  {
    id: 'inc-103',
    title: 'Clean Drinking Water Pipe Burst - Flooding 4th Cross',
    category: 'Water Leakage & Shortage',
    severity: 'High',
    description: 'Underground high pressure pipe cracked. Clean drinking water pooling over 50 meters of the residential street.',
    location: {
      lat: 12.9682,
      lng: 77.6455,
      address: '4th Cross, HAL 2nd Stage, Indiranagar',
      neighbourhood: 'HAL 2nd Stage',
      ward: 'Ward 112'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    status: 'Community Verified',
    isAnonymous: true,
    reporterId: 'anon-992',
    reporterName: 'Anonymous Resident',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    upvotes: ['usr-201', 'usr-202', 'usr-203', 'usr-204'],
    disputes: [],
    confirmationsCount: 4,
    disputesCount: 0,
    isFlaggedFalse: false,
    mergedReportsCount: 1,
    assignedTo: 'BWSSB Water Supply',
    assignedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't-7',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        title: 'Anonymous Report Filed',
        description: 'Water leak reported anonymously with GPS photo.',
        actor: 'Anonymous Resident',
        role: 'Resident',
        actionType: 'report'
      },
      {
        id: 't-8',
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        title: '4 Neighbour Confirmations',
        description: 'Verified by 4 residents living on 4th Cross.',
        actor: 'Community Consensus',
        role: 'Community',
        actionType: 'upvote'
      }
    ]
  },
  {
    id: 'inc-104',
    title: 'Fallen Tree Branch Obstructing Morning Bus Route',
    category: 'Civic & Infrastructure',
    severity: 'Medium',
    description: 'Heavy Gulmohar tree limb snapped during high winds. Partially blocks one lane of city bus route 138.',
    location: {
      lat: 12.9789,
      lng: 77.6421,
      address: 'Old Airport Road feeder lane near Domlur flyover',
      neighbourhood: 'Domlur / Indiranagar Border',
      ward: 'Ward 112'
    },
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    isAnonymous: false,
    reporterId: 'usr-current-1',
    reporterName: 'Arjun Mehta',
    reporterPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    upvotes: ['usr-101', 'usr-105', 'usr-109'],
    disputes: [],
    confirmationsCount: 3,
    disputesCount: 0,
    isFlaggedFalse: false,
    mergedReportsCount: 1,
    assignedTo: 'Municipal Forest / Tree Wing',
    assignedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    resolvedBy: 'Horticulture Team Alpha',
    resolutionNotes: 'Tree limb cut into manageable logs and transported away. Road completely clear for bus transit.',
    resolutionProofUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    timeline: [
      {
        id: 't-9',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        title: 'Reported by Arjun Mehta',
        description: 'Tree branch hazard logged with GPS location.',
        actor: 'Arjun Mehta',
        role: 'Resident',
        actionType: 'report'
      },
      {
        id: 't-10',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        title: 'Work Completed & Resolved',
        description: 'Horticulture unit completed branch removal with proof photo.',
        actor: 'Horticulture Team Alpha',
        role: 'Authority',
        actionType: 'resolution'
      }
    ]
  },
  {
    id: 'inc-105',
    title: 'Aggressive Stray Dogs Chasing Two-Wheelers at Night',
    category: 'Stray Animals',
    severity: 'Medium',
    description: 'Pack of 5 territorial dogs roaming near the corner grocery store after 9 PM. Two delivery riders fell yesterday trying to avoid bites.',
    location: {
      lat: 12.9645,
      lng: 77.6398,
      address: 'Near Eshwara Temple, Indira Nagar 1st Stage',
      neighbourhood: 'Indiranagar 1st Stage',
      ward: 'Ward 112'
    },
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    status: 'Unverified',
    isAnonymous: false,
    reporterId: 'usr-554',
    reporterName: 'Sanjay Deshmukh',
    reporterPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    upvotes: ['usr-554'],
    disputes: [],
    confirmationsCount: 1,
    disputesCount: 0,
    isFlaggedFalse: false,
    mergedReportsCount: 1,
    timeline: [
      {
        id: 't-11',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        title: 'Incident Reported',
        description: 'Sanjay Deshmukh reported stray animal hazard.',
        actor: 'Sanjay Deshmukh',
        role: 'Resident',
        actionType: 'report'
      }
    ]
  },
  {
    id: 'inc-106',
    title: 'Overflowing Commercial Waste Dumpster Spilling onto Walkway',
    category: 'Garbage & Sanitation',
    severity: 'Low',
    description: 'Black trash bags accumulated around community bin. Flies and unpleasant smell affecting nearby residences.',
    location: {
      lat: 12.9735,
      lng: 77.6468,
      address: '13th Cross, near CMH Road Metro Station',
      neighbourhood: 'CMH Road Corridor',
      ward: 'Ward 112'
    },
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    status: 'Authority Verified',
    isAnonymous: false,
    reporterId: 'usr-602',
    reporterName: 'Sunita Nair',
    reporterPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    upvotes: ['usr-602', 'usr-603', 'usr-604'],
    disputes: [],
    confirmationsCount: 3,
    disputesCount: 0,
    isFlaggedFalse: false,
    mergedReportsCount: 1,
    assignedTo: 'Municipal Solid Waste Management',
    assignedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 't-12',
        timestamp: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
        title: 'Reported by Sunita Nair',
        description: 'Garbage overflow logged.',
        actor: 'Sunita Nair',
        role: 'Resident',
        actionType: 'report'
      },
      {
        id: 't-13',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        title: 'Acknowledged by Ward Sanitation Inspector',
        description: 'Sanitation vehicle scheduled for evening route clearance.',
        actor: 'Ward 112 Inspector',
        role: 'Authority',
        actionType: 'assign'
      }
    ]
  }
];

export const MUNICIPAL_DEPARTMENTS = [
  'Municipal Road Works (PWD)',
  'BESCOM Electricity Board',
  'BWSSB Water Supply & Sewerage',
  'Municipal Solid Waste & Sanitation',
  'Animal Husbandry & Vet Care',
  'City Police & Traffic Control',
  'Emergency Fire & Disaster Response'
];
