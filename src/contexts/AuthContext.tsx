
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

type User = {
  id: string;
  email: string;
  name: string;
  role: 'marketing' | 'design' | 'sales';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'marketing' | 'design' | 'sales') => Promise<boolean>;
  logout: () => void;
  updateUserRole: (role: 'marketing' | 'design' | 'sales') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('aiva_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Mock login - in a real app, this would call your authentication API
      if (email && password) {
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          email,
          name: email.split('@')[0],
          role: 'marketing' as const
        };
        
        setUser(newUser);
        localStorage.setItem('aiva_user', JSON.stringify(newUser));
        toast.success("Login successful!");
        return true;
      }
      
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'marketing' | 'design' | 'sales'
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Mock signup - in a real app, this would call your authentication API
      if (email && password && name && role) {
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          email,
          name,
          role
        };
        
        setUser(newUser);
        localStorage.setItem('aiva_user', JSON.stringify(newUser));
        toast.success("Account created successfully!");
        return true;
      }
      
      toast.error("Please fill all required fields");
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aiva_user');
    toast.info("You've been logged out");
  };

  const updateUserRole = (role: 'marketing' | 'design' | 'sales') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('aiva_user', JSON.stringify(updatedUser));
      toast.success(`Role updated to ${role}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserRole }}>
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
