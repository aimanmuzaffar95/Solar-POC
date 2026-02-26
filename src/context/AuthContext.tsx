import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AppUser, UserRole, TeamAssignment } from '@/data/models';
import { users } from '@/data/seedData';

interface AuthContextType {
  user: AppUser | null;
  login: (role: UserRole, team?: TeamAssignment) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  const login = useCallback((role: UserRole, team?: TeamAssignment) => {
    if (role === 'admin') {
      setUser(users[0]);
    } else {
      const installer = users.find(u => u.role === 'installer' && u.team === team) || users[1];
      setUser(installer);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
