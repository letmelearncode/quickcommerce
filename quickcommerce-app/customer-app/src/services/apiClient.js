const API_BASE_URL = 'http://localhost:8080/api'; // Same as in authService

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('authToken');

/**
 * Wrapper around the native fetch function.
 * Automatically adds the Authorization header if a token exists.
 * Handles basic JSON parsing and error handling.
 * @param {string} endpoint - The API endpoint (e.g., '/users/me')
 * @param {object} options - Fetch options (method, body, custom headers, etc.)
 * @returns {Promise<any>} - Parsed JSON response or text response
 */
const apiClient = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // Allow overriding headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Check if response is successful
        if (!response.ok) {
            // Try to parse error message from backend
            let errorMessage = `API Request failed: ${response.status} ${response.statusText}`;
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || JSON.stringify(errorBody);
            } catch (e) {
                // If parsing as JSON fails, try parsing as text
                 try {
                    const textError = await response.text();
                    if (textError) {
                         errorMessage = textError;
                    }
                } catch (textErr) { /* Ignore if text parsing also fails */ }
            }
            console.error("API Client Error:", errorMessage);
            throw new Error(errorMessage);
        }

        // Handle potential empty responses (e.g., 204 No Content)
        if (response.status === 204) {
            return null; // Or return an empty object/string as needed
        }

        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json(); // Parse JSON response
        } else {
            // Attempt to return text for non-json responses
            const textResponse = await response.text();
            return textResponse; 
        }

    } catch (error) {
        console.error('API Client Network or other error:', error);
        // Ensure we always throw an Error object
        throw (error instanceof Error ? error : new Error(String(error))); 
    }
};

export default apiClient; 