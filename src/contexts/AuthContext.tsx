import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, tokenManager, authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (context === undefined) {
      console.error('useAuth must be used within an AuthProvider');
      if (process.env.NODE_ENV === 'development') {
        console.trace('useAuth call stack:');
      }
      // Return a default context to prevent crashes
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: async () => { throw new Error('Auth not initialized'); },
        register: async () => { throw new Error('Auth not initialized'); },
        logout: () => {},
        updateUser: () => {},
      };
    }
    return context;
  } catch (error) {
    console.error('Error in useAuth:', error);
    if (process.env.NODE_ENV === 'development') {
      console.trace('useAuth error stack:');
    }
    // Return a default context to prevent crashes
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => { throw new Error('Auth not initialized'); },
      register: async () => { throw new Error('Auth not initialized'); },
      logout: () => {},
      updateUser: () => {},
    };
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        if (tokenManager.isAuthenticated()) {
          // You could add a verify token endpoint here
          // For now, we'll just check if token exists
          console.log('User has valid token');
          setIsLoading(false);
        } else {
          console.log('No valid token found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenManager.clearTokens();
        setIsLoading(false);
      } finally {
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email_id: email, password });
      
      // Store tokens
      tokenManager.setTokens(response.token, response.refreshToken);
      
      // Set user
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);
      
      // Store tokens
      tokenManager.setTokens(response.token, response.refreshToken);
      
      // Set user
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  // Don't render children until the auth provider is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
