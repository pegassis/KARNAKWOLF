import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiConfig';

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  token: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const storedSessionId = localStorage.getItem('adminSessionId');
    if (adminToken === 'admin-authenticated' && storedSessionId) {
      setIsAdmin(true);
      setSessionId(storedSessionId);
      setToken(adminToken);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Call backend authentication endpoint
      const response = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminSessionId', data.sessionId);
        setIsAdmin(true);
        setSessionId(data.sessionId);
        setToken(data.token);
        setLoading(false);
        return true;
      } else {
        const errorData = await response.json();
        // Handle the specific case of admin already logged in
        if (response.status === 409) {
          setError('Admin is already logged in. Only one admin can be logged in at a time.');
        } else {
          setError(errorData.message || 'Invalid credentials');
        }
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('Failed to connect to authentication server');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    const storedSessionId = localStorage.getItem('adminSessionId');
    
    // Notify backend of logout
    if (storedSessionId) {
      try {
        await fetch(`${getApiUrl()}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: storedSessionId }),
        });
      } catch (err) {
        console.error('Logout notification failed:', err);
      }
    }

    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminSessionId');
    setIsAdmin(false);
    setSessionId(null);
    setToken(null);
    setError(null);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loading, error, sessionId, token }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
