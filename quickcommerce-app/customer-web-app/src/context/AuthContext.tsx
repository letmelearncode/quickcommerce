'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for user session on initial load
  useEffect(() => {
    async function loadUserFromSession() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
          setUser(null);
          return;
        }
        
        // Fetch user details using the token
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user session:', error);
        setUser(null);
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserFromSession();
  }, []);
  
  // Login function
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }
      
      // Get the token data
      const data = await response.json();
      console.log('Login response:', data);
      
      // Set expiration date - 24 hours for session, 30 days for remember me
      const expirationDate = new Date();
      if (rememberMe) {
        expirationDate.setDate(expirationDate.getDate() + 30); // 30 days
        localStorage.setItem('authToken', data.accessToken);
      } else {
        expirationDate.setDate(expirationDate.getDate() + 1); // 24 hours
        sessionStorage.setItem('authToken', data.accessToken);
      }
      
      // Set cookie with proper attributes for middleware detection
      document.cookie = `authToken=${data.accessToken}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
      
      console.log('Auth token set in cookie:', data.accessToken ? 'Yes' : 'No');
      
      // Create a temporary user object based on the email
      // This avoids the need for a separate API call to /users/me
      const tempUser = {
        id: '1', // Placeholder ID
        name: email.split('@')[0], // Use part of email as name
        email: email
      };
      
      // Set the user in state
      setUser(tempUser);
      
      // After a short delay, redirect to the home page
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google login function
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // This would typically open a Google OAuth flow
      // For now, we'll just mock this with a placeholder
      console.log('Google login not yet implemented');
      throw new Error('Google login not yet implemented');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    // Clear the cookie as well
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
  };
  
  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      // Don't auto-login, just return success for redirect to login page
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 