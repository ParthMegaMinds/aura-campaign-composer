
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";
import type { User } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'marketing' | 'design' | 'sales';
};

type AuthContextType = {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: profile.full_name || authUser.email?.split('@')[0] || '',
          role: 'marketing' // Default role, can be stored in profile later
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success("Login successful!");
        return true;
      }
      
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success("Account created successfully! Please check your email to verify your account.");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info("You've been logged out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  const updateUserRole = async (role: 'marketing' | 'design' | 'sales') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
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
