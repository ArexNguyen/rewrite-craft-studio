
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  username: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  credits: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserCredits: (newCredits: number) => void;
  updateUserPlan: (newPlan: 'free' | 'basic' | 'pro' | 'enterprise') => void;
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    plan: 'free',
    credits: 10,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'pro@example.com',
    username: 'prouser',
    password: 'password123',
    plan: 'pro',
    credits: 100,
    createdAt: new Date().toISOString()
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user info in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call / authentication
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      const authenticatedUser = userWithoutPassword as User;
      
      // Save to state and localStorage
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${authenticatedUser.username}!`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        username,
        plan: 'free',
        credits: 15, // Starting credits
        createdAt: new Date().toISOString()
      };
      
      // Save to state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: `Welcome to TextHuman, ${username}!`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const updateUserCredits = (newCredits: number) => {
    if (user) {
      const updatedUser = { ...user, credits: newCredits };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateUserPlan = (newPlan: 'free' | 'basic' | 'pro' | 'enterprise') => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Add plan-specific credits
      let additionalCredits = 0;
      switch(newPlan) {
        case 'basic': additionalCredits = 50; break;
        case 'pro': additionalCredits = 100; break;
        case 'enterprise': additionalCredits = 500; break;
      }
      
      if (additionalCredits > 0) {
        updateUserCredits(user.credits + additionalCredits);
      }
      
      toast({
        title: "Plan updated!",
        description: `Your subscription has been updated to ${newPlan.toUpperCase()}`,
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserCredits,
    updateUserPlan
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
