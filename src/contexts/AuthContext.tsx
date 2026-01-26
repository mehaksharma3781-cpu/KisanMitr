import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FarmerProfile {
  state: string;
  district: string;
  landSize: string;
  irrigationType: string;
  soilType: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  hasProfile: boolean;
  profile: FarmerProfile | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  saveProfile: (profile: FarmerProfile) => void;
  updateProfile: (profile: Partial<FarmerProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAIL = 'farmer.demo@krushiai.app';
const DEMO_PASSWORD = 'Demo@123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);

  const login = (email: string, password: string): boolean => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasProfile(false);
    setProfile(null);
  };

  const saveProfile = (newProfile: FarmerProfile) => {
    setProfile(newProfile);
    setHasProfile(true);
  };

  const updateProfile = (updates: Partial<FarmerProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      hasProfile, 
      profile, 
      login, 
      logout, 
      saveProfile,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
