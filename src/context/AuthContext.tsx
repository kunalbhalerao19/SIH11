import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'officer' | 'collector' | 'citizen';

export interface UserProfile {
  name: string;
  role: UserRole;
  designation: string;
  jurisdiction: string;
  department: string;
}

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  loginAs: (role: UserRole, customName?: string, jurisdiction?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  officer: {
    name: 'Dr. Rajesh Verma, IAS',
    role: 'officer',
    designation: 'Joint Secretary & National Program Director',
    jurisdiction: 'Ministry of Statistics & PI, New Delhi',
    department: 'National MPLADS Monitoring Wing',
  },
  collector: {
    name: 'Pooja Kulkarni, IAS',
    role: 'collector',
    designation: 'District Magistrate & Collector',
    jurisdiction: 'Pune & Western Maharashtra Region',
    department: 'District Vigilance & Implementation Committee',
  },
  citizen: {
    name: 'Anand Deshmukh',
    role: 'citizen',
    designation: 'Citizen Auditor & Local Resident',
    jurisdiction: 'Hingoli / Pune Constituency',
    department: 'Public Social Audit Network',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem('mplads_user_role') as UserRole | null;
    if (savedRole && ROLE_PROFILES[savedRole]) {
      return ROLE_PROFILES[savedRole];
    }
    return ROLE_PROFILES.officer; // Default demo role
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mplads_auth_token') !== 'logged_out';
  });

  useEffect(() => {
    localStorage.setItem('mplads_user_role', user.role);
  }, [user]);

  const loginAs = (role: UserRole, customName?: string, jurisdiction?: string) => {
    const base = ROLE_PROFILES[role];
    const updated: UserProfile = {
      ...base,
      name: customName || base.name,
      jurisdiction: jurisdiction || base.jurisdiction,
    };
    setUser(updated);
    setIsAuthenticated(true);
    localStorage.setItem('mplads_user_role', role);
    localStorage.setItem('mplads_auth_token', 'active_session');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('mplads_auth_token', 'logged_out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        loginAs,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
