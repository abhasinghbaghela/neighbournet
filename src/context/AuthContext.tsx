import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER } from '../services/mockData';
import {
  loginWithGoogle,
  loginAnonymously,
  logoutUser,
  subscribeToAuthChanges,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  subscribeToLeaderboardFromFirestore
} from '../services/firebase';

export interface LeaderboardEntry {
  uid: string;
  name: string;
  avatar: string;
  role: UserRole;
  xp: number;
  level: number;
  reportsCount: number;
  verificationsCount: number;
  badges: string[];
}

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    uid: 'usr-top-1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'resident',
    xp: 620,
    level: 4,
    reportsCount: 8,
    verificationsCount: 24,
    badges: ['First Responder', 'Civic Scout', 'Eagle Eye']
  },
  {
    uid: 'usr-top-2',
    name: 'Kavita Rao',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'resident',
    xp: 540,
    level: 3,
    reportsCount: 6,
    verificationsCount: 18,
    badges: ['Community Pillar', 'First Responder']
  },
  {
    uid: 'usr-top-3',
    name: 'Deepak Mohan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'volunteer',
    xp: 505,
    level: 3,
    reportsCount: 5,
    verificationsCount: 16,
    badges: ['Vigilant Guardian', 'Civic Scout']
  },
  {
    uid: 'usr-current-1',
    name: 'Arvind K.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    role: 'resident',
    xp: 485,
    level: 3,
    reportsCount: 4,
    verificationsCount: 12,
    badges: ['First Responder', 'Civic Scout', 'Tier II Guardian']
  }
];

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  loginWithNameAndGmail: (name: string, gmail: string, role?: UserRole, ward?: string) => void;
  signInGoogle: (role?: UserRole, ward?: string) => Promise<{ success: boolean; fallbackNeeded?: boolean; error?: string }>;
  signInAnon: () => Promise<void>;
  signOut: () => Promise<void>;
  awardXp: (amount: number, reason: string) => { isLevelUp: boolean; newBadges: string[] };
  updateNotificationSettings: (radiusKm: number, pushEnabled: boolean) => void;
  leaderboard: LeaderboardEntry[];
  celebrationModal: { isOpen: boolean; title: string; message: string; badge?: string } | null;
  closeCelebrationModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if session was authenticated in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('civicquest_authenticated') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('civicquest_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      uid: 'usr-arvind',
      name: 'Arvind K.',
      email: 'arvind.k@gmail.com',
      role: 'resident',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
      xp: 485,
      level: 3,
      badges: ['First Responder', 'Civic Scout', 'Tier II Guardian'],
      reportsSubmitted: 4,
      reportsVerified: 12,
      neighbourhood: 'Ward 14 (Greenwood Heights)',
      notificationRadiusKm: 2.5,
      pushEnabled: true,
      joinedAt: new Date().toISOString()
    };
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(LEADERBOARD_DATA);
  const [celebrationModal, setCelebrationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    badge?: string;
  } | null>(null);

  // Sync authenticated user to local storage and Firestore
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('civicquest_authenticated', 'true');
      localStorage.setItem('civicquest_user', JSON.stringify(user));
      saveUserProfileToFirestore(user);
    }
  }, [user, isAuthenticated]);

  // Subscribe to Firestore Leaderboard
  useEffect(() => {
    const unsubLeaderboard = subscribeToLeaderboardFromFirestore(remoteUsers => {
      if (remoteUsers && remoteUsers.length > 0) {
        const mapped: LeaderboardEntry[] = remoteUsers.map(u => ({
          uid: u.uid,
          name: u.name,
          avatar: u.avatar,
          role: u.role,
          xp: u.xp,
          level: u.level,
          reportsCount: u.reportsSubmitted,
          verificationsCount: u.reportsVerified,
          badges: u.badges
        }));
        const combined = [...mapped];
        LEADERBOARD_DATA.forEach(seeded => {
          if (!combined.some(c => c.uid === seeded.uid)) {
            combined.push(seeded);
          }
        });
        combined.sort((a, b) => b.xp - a.xp);
        setLeaderboard(combined);
      }
    });

    return () => {
      unsubLeaderboard();
    };
  }, []);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async fbUser => {
      if (fbUser) {
        const remoteProfile = await getUserProfileFromFirestore(fbUser.uid);
        if (remoteProfile) {
          setUser(remoteProfile);
        } else {
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || 'Resident Citizen',
            email: fbUser.email || 'citizen@gmail.com',
            role: 'resident',
            avatar:
              fbUser.photoURL ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.displayName || 'Google')}`,
            xp: 485,
            level: 3,
            badges: ['First Responder', 'Civic Scout'],
            reportsSubmitted: 1,
            reportsVerified: 3,
            neighbourhood: 'Ward 14 (Greenwood Heights)',
            notificationRadiusKm: 2.5,
            pushEnabled: true,
            joinedAt: new Date().toISOString()
          };
          setUser(newProfile);
          saveUserProfileToFirestore(newProfile);
        }
        setIsAuthenticated(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Login with Name & Gmail
  const loginWithNameAndGmail = (name: string, gmail: string, role?: UserRole, ward?: string) => {
    const trimmedName = name.trim() || 'Resident Citizen';
    const trimmedGmail = gmail.trim().toLowerCase() || 'resident@gmail.com';
    const assignedRole = role || 'resident';

    const newProfile: UserProfile = {
      uid: `usr-${Date.now()}`,
      name: trimmedName,
      email: trimmedGmail,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
      xp: 485,
      level: 3,
      badges: ['First Responder', 'Civic Scout', 'Tier II Guardian'],
      reportsSubmitted: 2,
      reportsVerified: 8,
      neighbourhood: ward || 'Ward 14 (Greenwood Heights)',
      notificationRadiusKm: 2.5,
      pushEnabled: true,
      joinedAt: new Date().toISOString()
    };

    setUser(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('civicquest_authenticated', 'true');
    localStorage.setItem('civicquest_user', JSON.stringify(newProfile));
    saveUserProfileToFirestore(newProfile);
  };

  const signInGoogle = async (
    role?: UserRole,
    ward?: string
  ): Promise<{ success: boolean; fallbackNeeded?: boolean; error?: string }> => {
    try {
      const res = await loginWithGoogle();
      if (res && res.user) {
        const fbUser = res.user;
        const profile: UserProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || 'Google Citizen',
          email: fbUser.email || 'citizen@gmail.com',
          role: role || 'resident',
          avatar:
            fbUser.photoURL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.displayName || 'Google')}`,
          xp: 485,
          level: 3,
          badges: ['First Responder', 'Civic Scout'],
          reportsSubmitted: 2,
          reportsVerified: 8,
          neighbourhood: ward || 'Ward 14 (Greenwood Heights)',
          notificationRadiusKm: 2.5,
          pushEnabled: true,
          joinedAt: new Date().toISOString()
        };
        setUser(profile);
        setIsAuthenticated(true);
        localStorage.setItem('civicquest_authenticated', 'true');
        localStorage.setItem('civicquest_user', JSON.stringify(profile));
        return { success: true };
      }
      return { success: false, fallbackNeeded: true, error: res?.error };
    } catch (e: any) {
      console.warn('Google sign-in exception:', e);
      return { success: false, fallbackNeeded: true, error: e?.message };
    }
  };

  const signInAnon = async () => {
    try {
      await loginAnonymously();
      setIsAuthenticated(true);
      localStorage.setItem('civicquest_authenticated', 'true');
    } catch (e) {
      console.warn('Anonymous sign-in exception:', e);
    }
  };

  // Sign out cleanly
  const signOut = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    setIsAuthenticated(false);
    localStorage.removeItem('civicquest_authenticated');
    localStorage.removeItem('civicquest_user');
  };

  const setRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  const updateNotificationSettings = (radiusKm: number, pushEnabled: boolean) => {
    setUser(prev => ({
      ...prev,
      notificationRadiusKm: radiusKm,
      pushEnabled
    }));
  };

  const awardXp = (amount: number, reason: string) => {
    const newXp = user.xp + amount;
    const newLevel = Math.floor(newXp / 150) + 1;
    const isLevelUp = newLevel > user.level;

    const newBadges = [...user.badges];
    if (newLevel >= 4 && !newBadges.includes('Community Pillar')) {
      newBadges.push('Community Pillar');
    }
    if (user.reportsVerified + 1 >= 15 && !newBadges.includes('Vigilant Guardian')) {
      newBadges.push('Vigilant Guardian');
    }
    if (user.reportsSubmitted + 1 >= 5 && !newBadges.includes('Civic Vanguard')) {
      newBadges.push('Civic Vanguard');
    }

    const hasNewBadge = newBadges.length > user.badges.length;

    const updatedProfile: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevel,
      badges: newBadges,
      reportsSubmitted: reason.includes('report') ? user.reportsSubmitted + 1 : user.reportsSubmitted,
      reportsVerified: reason.includes('verify') ? user.reportsVerified + 1 : user.reportsVerified
    };

    setUser(updatedProfile);

    // Confetti celebration
    if (isLevelUp || hasNewBadge) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setCelebrationModal({
        isOpen: true,
        title: isLevelUp ? `🎉 Rank Advanced to Level ${newLevel}!` : '🎖️ New Civic Distinction Badge!',
        message: isLevelUp
          ? `You have earned ${amount} Karma and unlocked higher quorum weighting in Ward 14!`
          : `Congratulations! You unlocked the "${newBadges[newBadges.length - 1]}" badge.`,
        badge: hasNewBadge ? newBadges[newBadges.length - 1] : undefined
      });
    }

    return { isLevelUp, newBadges };
  };

  const closeCelebrationModal = () => {
    setCelebrationModal(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setRole,
        loginWithNameAndGmail,
        signInGoogle,
        signInAnon,
        signOut,
        awardXp,
        updateNotificationSettings,
        leaderboard,
        celebrationModal,
        closeCelebrationModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
