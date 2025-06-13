
import React, { createContext, useContext, ReactNode } from 'react';

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'marketing' | 'design' | 'sales';
};

type AuthContextType = {
  user: AuthUser | null;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'marketing' | 'design' | 'sales') => Promise<boolean>;
  signupWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUserRole: (role: 'marketing' | 'design' | 'sales') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Mock user for public access
  const mockUser: AuthUser = {
    id: 'public-user',
    email: 'public@example.com',
    name: 'Public User',
    role: 'marketing'
  };

  // Mock functions - all return success/do nothing
  const login = async (email: string, password: string): Promise<boolean> => {
    return true;
  };

  const loginWithGoogle = async (): Promise<void> => {
    // Do nothing
  };
  
  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'marketing' | 'design' | 'sales'
  ): Promise<boolean> => {
    return true;
  };

  const signupWithGoogle = async (): Promise<void> => {
    // Do nothing
  };

  const logout = async () => {
    // Do nothing
  };

  const updateUserRole = (role: 'marketing' | 'design' | 'sales') => {
    // Do nothing
  };

  return (
    <AuthContext.Provider value={{ 
      user: mockUser, 
      session: { user: mockUser },
      loading: false, 
      login, 
      loginWithGoogle, 
      signup, 
      signupWithGoogle, 
      logout, 
      updateUserRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
