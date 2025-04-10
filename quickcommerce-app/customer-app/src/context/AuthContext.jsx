import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../services/authService'; // Renamed to avoid conflict

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(false); // Changed: manage initial loading state
    // const [user, setUser] = useState(null); // Can add user details later

    // Optional: Effect to potentially validate token on initial load
    // useEffect(() => {
    //     const checkToken = async () => {
    //         if (token) {
    //             setIsLoading(true);
    //             try {
    //                 // Example: Call an endpoint like /api/users/me to validate token and get user
    //                 // const userData = await apiService.getCurrentUser(token);
    //                 // setUser(userData);
    //                 setIsAuthenticated(true);
    //             } catch (error) { // Token invalid or expired
    //                 console.error("Token validation failed", error);
    //                 localStorage.removeItem('authToken');
    //                 setToken(null);
    //                 setIsAuthenticated(false);
    //                 // setUser(null);
    //             } finally {
    //                 setIsLoading(false);
    //             }
    //         } else {
    //              setIsLoading(false); // No token, not loading
    //         }
    //     };
    //     checkToken();
    // }, []); // Run only once on mount

    // Login function
    const login = async (credentialsOrToken) => {
        setIsLoading(true);
        try {
            let data;
            if (credentialsOrToken.manualToken) {
                // If a token is provided directly (e.g., from Google login)
                console.log("[AuthContext] Using provided manual token.");
                data = { accessToken: credentialsOrToken.manualToken };
            } else {
                // Otherwise, call the API service with email/password
                console.log("[AuthContext] Calling API login service.");
                data = await apiLogin(credentialsOrToken); 
            }
            
            if (!data || !data.accessToken) {
                throw new Error("Login failed: No access token received.");
            }

            localStorage.setItem('authToken', data.accessToken);
            setToken(data.accessToken);
            setIsAuthenticated(true);
            setIsLoading(false);
            return data;
        } catch (error) { 
            setIsLoading(false);
            localStorage.removeItem('authToken');
            setToken(null);
            setIsAuthenticated(false);
            console.error("AuthContext Login error:", error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setIsAuthenticated(false);
        // setUser(null);
        // Optionally: navigate to login page or homepage
        console.log("User logged out");
    };

    const value = {
        token,
        isAuthenticated,
        isLoading,
        // user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 