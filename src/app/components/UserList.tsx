"use client";
import React, { useState, useEffect } from 'react'
import User from './User';
import UserInterface from '../interface/user';
import AddUser from './AddUser';

const UserList = () => {
  const USER_API = "http://127.0.0.1:8080/api/v1/users";
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State variable to store error message
  const [showPopup, setShowPopup] = useState(false); // State variable to control the visibility of the pop-up

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(USER_API, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData: UserInterface[] = await res.json();
        setUsers(usersData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Set error message if err is an instance of Error
        } else {
          setError('An unknown error occurred'); // Fallback error message for unknown error types
        }
        setShowPopup(true); // Display the pop-up when an error occurs
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='container mx-auto my-6'>
        <div className='flex shadow border-b'>
          <table className='min-w-full'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='text-gray-600 py-2 px-3'>ID</th>
                <th className='text-gray-600 py-2 px-3'>Name</th>
                <th className='text-gray-600 py-2 px-3'>Email</th>
                <th className='text-gray-600 py-2 px-3'>Phone</th>
                <th className='text-gray-600 py-2 px-3'>Address</th>
                <th className='text-gray-600 py-2 px-3'>Actions</th>
              </tr>
            </thead>
            {!loading && users && (
              <tbody className='bg-white'>
                {users.map((user) => (
                  <User user={user} key={user.id}></User>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {showPopup && (
          <div className="fixed inset-2 flex items-center justify-center z-50">
            <div className="relative bg-white p-8 mt-5 rounded shadow-md" style={{ width: 500, height: 250 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white rounded shadow-md"></div>
              <div className="relative flex flex-col justify-between h-full">
                <div className="bg-red-500 px-4 py-6 mt-7 text-white mb-4">{error}</div>
                <div className="flex justify-end">
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>Close</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div></>
  );
};

export default UserList;
