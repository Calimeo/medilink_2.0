import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  API
    .get("/api/v1/user/patient/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setUser(res.data.user))
    .catch((err) => {
      toast.error(err.response?.data?.message || "Error loading profile");
    });
}, []);


  if (!user) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <img
            src="https://www.svgrepo.com/show/452030/avatar-default.svg"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-main_theme mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-gray-500 mb-4">{user.role}</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="mb-2">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-md text-gray-800 font-medium">{user.email}</p>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-md text-gray-800 font-medium">{user.phone}</p>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">NIC</p>
            <p className="text-md text-gray-800 font-medium">{user.nic}</p>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-md text-gray-800 font-medium">
              {user.dob?.slice(0, 10)}
            </p>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-md text-gray-800 font-medium">{user.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
