"use client";
import React, { useState, useEffect, useRef } from "react";
import User from "./User";
import UserInterface from "../interface/user";
import { EditUser } from "./EditUser";

const UserList = ({ user }: { user: any }) => {
  const USER_API = "http://127.0.0.1:8080/api/v1/users";
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null); // Ref to the pop-up div
  const [userId, setUserId] = useState<number | null>(null);
  const [resUser, setResUser] = useState<any |null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(USER_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          // throw new Error('Failed to fetch users');
        }
        const usersData = await res.json();
        setUsers(usersData.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setShowPopup(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, resUser]);

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener("click", handleClickOutside);
    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const deleteUser = (e: React.FocusEvent<HTMLInputElement>, id: number) => {
    e.preventDefault();
    fetch(USER_API + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => {
      if (users) {
        setUsers((prevElement) => {
          return prevElement.filter((user) => user.id !== id);
        });
      }
    });
  };

  const editUser = (e: React.FocusEvent<HTMLInputElement>, id: number) => {
    e.preventDefault();
    setUserId(id);
  };

  // Function to handle clicks outside the pop-up
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowPopup(false); // Close the pop-up if the click occurs outside of it
    }
  };

  return (
<>
  <div className="container mx-auto my-6">
    <EditUser userID={userId} setResUser={setResUser}></EditUser>
    <div className="flex shadow border-b overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-gray-600 py-2 px-3">ID</th>
            <th className="text-gray-600 py-2 px-3">Name</th>
            <th className="text-gray-600 py-2 px-3">Email</th>
            <th className="text-gray-600 py-2 px-3">Phone</th>
            <th className="text-gray-600 py-2 px-3">Address</th>
            <th className="text-gray-600 py-2 px-3">Actions</th>
          </tr>
        </thead>
        {!loading && users && (
          <tbody className="bg-white">
            {users.map((user) => (
              <User
                user={user}
                editUser={editUser}
                deleteUser={deleteUser}
                key={user.id}
              ></User>
            ))}
          </tbody>
        )}
      </table>
    </div>
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div
          ref={popupRef}
          className="relative bg-white rounded shadow-md"
          style={{ width: "90%", maxWidth: 450, height: 70 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white rounded shadow-md"></div>
          <div className="relative flex flex-col justify-between h-full">
            <div className="bg-red-500 px-4 py-6 text-white mb-4">
              {error}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</>

  );
};

export default UserList;
