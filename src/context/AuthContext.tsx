import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, name: string, shopName: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial default user for instant testing
const defaultUser: User = {
  id: 'usr-1',
  name: 'Somveer Sharma',
  email: 'somveer@agri.com',
  shopName: 'किसान सेवा एवं कृषि केंद्र (Kisan Seva Kendra)',
  phone: '9812001122',
  authProvider: 'email',
  createdAt: '2026-09-01T10:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('arms_current_user');
    return saved ? JSON.parse(saved) : defaultUser; // Start with default logged-in or null
  });

  const [registeredUsers, setRegisteredUsers] = useState<Array<User & { password?: string }>>(() => {
    const saved = localStorage.getItem('arms_registered_users');
    return saved
      ? JSON.parse(saved)
      : [
          {
            ...defaultUser,
            password: 'password123',
          },
        ];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('arms_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('arms_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('arms_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate brief authentication latency
    await new Promise(r => setTimeout(r, 400));

    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      return { success: false, message: 'No account found with this email. Please sign up.' };
    }

    if (existing.password && existing.password !== password) {
      return { success: false, message: 'Invalid password. Please check and try again.' };
    }

    const authUser: User = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      shopName: existing.shopName,
      phone: existing.phone,
      photoUrl: existing.photoUrl,
      authProvider: existing.authProvider || 'email',
      createdAt: existing.createdAt,
    };

    setUser(authUser);
    return { success: true };
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    shopName: string,
    phone: string
  ): Promise<{ success: boolean; message?: string }> => {
    await new Promise(r => setTimeout(r, 400));

    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      shopName: shopName.trim() || 'My Agri Retail Store',
      phone: phone.trim(),
      authProvider: 'email',
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers(prev => [...prev, { ...newUser, password }]);
    setUser(newUser);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    // Simulated Google OAuth Flow (can be hooked directly to Firebase / Google Cloud OAuth Client ID)
    await new Promise(r => setTimeout(r, 600));

    // Simulated Google User Profile
    const googleUser: User = {
      id: `google-usr-${Date.now()}`,
      name: 'Google Retailer',
      email: 'agri.retailer@gmail.com',
      shopName: 'किसान कृषि भंडार (Google Verified)',
      photoUrl: 'https://lh3.googleusercontent.com/a/default-user',
      authProvider: 'google',
      createdAt: new Date().toISOString(),
    };

    // Check if already in registry
    const existing = registeredUsers.find(u => u.email === googleUser.email);
    if (!existing) {
      setRegisteredUsers(prev => [...prev, googleUser]);
    }

    setUser(googleUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
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
