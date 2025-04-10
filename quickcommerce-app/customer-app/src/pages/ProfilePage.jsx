import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth to potentially display user info
import apiClient from '../services/apiClient'; // Import apiClient

function ProfilePage() {
  const { logout } = useAuth(); // Get logout function
  const [profileData, setProfileData] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Use apiClient - Auth header is added automatically
        const data = await apiClient('/test/protected'); 
        setProfileData(data); // Should be "Hello, <email>! This is protected data."
      } catch (err) {
        console.error("Failed to fetch protected data:", err);
        setError(err.message || 'Failed to load profile data.');
        setProfileData('Error loading data.');
      }
    };

    fetchProfileData();
  }, []); // Run once on component mount

  // In a real app, you might fetch and display user details
  // const { user } = useAuth(); 

  return (
    <div>
      <h2>My Profile</h2>
      <p>Welcome! You are logged in.</p>
      <p><strong>Server Response:</strong> {profileData}</p>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      {/* Display user details here later */} 
      {/* {user && <p>Email: {user.email}</p>} */}
      
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default ProfilePage; 