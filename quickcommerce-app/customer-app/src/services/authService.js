import apiClient from './apiClient'; // Import the new client

export const signUp = async (userData) => {
    // apiClient handles base URL, headers, and basic error/parsing
    return apiClient('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const login = async (credentials) => {
     // apiClient handles base URL, headers, and basic error/parsing
    return apiClient('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

/**
 * Sends Google ID token to backend for validation and login/signup.
 * @param {string} idToken - The JWT ID token received from Google Sign-In.
 * @returns {Promise<object>} - Backend response (e.g., containing app JWT token).
 */
export const loginWithGoogle = async (idToken) => {
    return apiClient('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: idToken }), // Send token in expected format
    });
};

// We can add other service functions here later, e.g.:
// export const getCurrentUser = async () => {
//    return apiClient('/users/me'); // Assumes GET by default
// };

// Add login function later
// export const login = async (credentials) => { ... }; 