import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the credential
import { loginWithGoogle } from '../services/authService'; // Import Google login service

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get location object
    const { login } = useAuth(); // Get the MAIN login function from context

    // Determine where to redirect after login
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Email and password are required.');
            setLoading(false);
            return;
        }

        try {
            console.log('Calling context login with:', { email }); 
            // Call the login function from the context
            await login({ email, password }); 
            console.log('Login successful (via context)');
            
            // Context handles token storage and state update
            
            navigate(from, { replace: true }); // Redirect to original destination or home

        } catch (err) {
            console.error('Login failed:', err);
            // Error should be re-thrown by context login function
            setError(err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for Google login success
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        console.log("Google Login Success:", credentialResponse);
        const googleToken = credentialResponse.credential;

        // Decode for logging (optional)
        try {
            const decoded = jwtDecode(googleToken);
            console.log("Decoded Google Credential:", decoded);
        } catch (e) { console.error("Failed to decode Google credential", e); }

        setError('');
        setLoading(true); // Set loading state

        try {
            // Send Google token to backend
            const backendResponse = await loginWithGoogle(googleToken);
            console.log("Backend response after Google token submission:", backendResponse);

            // IMPORTANT ASSUMPTION: Backend returns a JWT (`accessToken`) in the same format
            // as the regular email/password login after verifying the Google token.
            if (backendResponse && backendResponse.accessToken) {
                // Use the existing context login logic to store the token and update auth state
                // We manually create the expected structure for the context login
                await login({ manualToken: backendResponse.accessToken }); 
                console.log('Google Login successful (via context)');
                navigate(from, { replace: true }); // Redirect after successful login
            } else {
                throw new Error("Backend did not return a valid access token after Google Sign-In.");
            }

        } catch (err) {
            console.error('Google Login failed during backend processing:', err);
            setError(err.message || 'Google Sign-In failed. Please try again.');
        } finally {
            setLoading(false); // Clear loading state
        }
    };

    // Handler for Google login error
    const handleGoogleLoginError = () => {
        console.error('Google Login Failed');
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Welcome Back</h2>
            
            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input Group */} 
                <div>
                    <label htmlFor="email"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:opacity-60"
                        />
                    </div>
                </div>
                
                {/* Password Input Group */} 
                <div>
                    <label htmlFor="password"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:opacity-60"
                        />
                    </div>
                     {/* TODO: Add Forgot Password link here later */}
                </div>
                
                {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
                
                {/* Submit Button */} 
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                    {loading ? 'Logging In...' : 'Log in'}
                </button>
            </form>
            
            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
                </div>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    theme="outline" // Use outline theme for better consistency
                    size="large"    // Use large size
                />
            </div>
        </div>
    );
}

export default LoginPage; 