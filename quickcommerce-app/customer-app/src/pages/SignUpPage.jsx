import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/authService'; // Import the API function

function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation (more robust validation can be added)
        if (!name || !email || !password) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            console.log('Calling API with:', { name, email, password });
            const response = await signUp({ name, email, password });
            console.log('Sign up successful:', response.message);
            // Redirect to login page on success
            // Optional: Show a success message before redirecting
            navigate('/login'); 

        } catch (err) {
            console.error('Sign up failed:', err);
            // Display the error message from the API service or a default one
            setError(err.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input Group */} 
                <div>
                    <label htmlFor="name"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:opacity-60"
                        />
                    </div>
                </div>

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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:opacity-60"
                        />
                    </div>
                </div>
                
                {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
                
                {/* Submit Button */} 
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                    {loading ? 'Signing Up...' : 'Create Account'}
                </button>
            </form>
            {/* Optional: Add link to Login page */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account? {' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Log in
                </Link>
            </p>
        </div>
    );
}

export default SignUpPage; 