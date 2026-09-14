import React, { useState, useEffect } from 'react';
import { AuthContext, ROLE_PROFILES, type UserProfile, type UserRole } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem('mplads_user_role') as UserRole | null;
    if (savedRole && ROLE_PROFILES[savedRole]) {
      return ROLE_PROFILES[savedRole];
    }
    return ROLE_PROFILES.officer; // Default demo role
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mplads_auth_token') === 'active_session';
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
    localStorage.removeItem('mplads_auth_token');
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
