import { createContext } from 'react';

export type UserRole = 'officer' | 'collector' | 'citizen';

export interface UserProfile {
  name: string;
  role: UserRole;
  designation: string;
  jurisdiction: string;
  department: string;
}

export interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  loginAs: (role: UserRole, customName?: string, jurisdiction?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const ROLE_PROFILES: Record<UserRole, UserProfile> = {
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
