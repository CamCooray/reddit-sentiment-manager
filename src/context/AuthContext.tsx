import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('reddit-sentiment-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.expiry > Date.now()) {
          setIsAuthenticated(true);
          setUser(authData.user);
        } else {
          localStorage.removeItem('reddit-sentiment-auth');
        }
      } catch (error) {
        localStorage.removeItem('reddit-sentiment-auth');
      }
    }
  }, []);

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    // Get credentials from environment variables
    const validUsername = import.meta.env.VITE_AUTH_USERNAME;
    const validPassword = import.meta.env.VITE_AUTH_PASSWORD;
    
    // Debug: Log environment variables (remove in production)
    console.log('Environment check:', {
      hasUsername: !!validUsername,
      hasPassword: !!validPassword,
      usernameValue: validUsername,
      passwordValue: validPassword, // Temporary for debugging
      mode: import.meta.env.MODE,
      allEnv: Object.keys(import.meta.env)
    });
    
    // Check if environment variables are set
    if (!validUsername || !validPassword) {
      console.error('Authentication credentials not configured. Please set VITE_AUTH_USERNAME and VITE_AUTH_PASSWORD environment variables.');
      console.error('Available env vars:', Object.keys(import.meta.env));
      return false;
    }
    
    if (credentials.username === validUsername && credentials.password === validPassword) {
      const authData = {
        user: { username: credentials.username },
        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      setIsAuthenticated(true);
      setUser({ username: credentials.username });
      localStorage.setItem('reddit-sentiment-auth', JSON.stringify(authData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('reddit-sentiment-auth');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
