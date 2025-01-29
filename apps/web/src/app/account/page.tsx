'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backendUrl from '@/helpers/backend_url';

const Account = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/user/${userId}/account`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <p><span className="font-bold">Full Name:</span> {user.fullName}</p>
        <p><span className="font-bold">Email:</span> {user.email}</p>
        <p><span className="font-bold">Email Verified:</span> {user.emailVerified ? 'Yes' : 'No'}</p>
        <p><span className="font-bold">Created At:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Account;
