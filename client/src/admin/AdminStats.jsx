import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets"; // where your admin sticker is
import axios from "axios";
import api from "../utils/axiosInstance";

const AdminDashboard = () => {
  const { backendurl } = useContext(AppContext);
  const [stats, setStats] = useState(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await api.get(backendurl+"/api/admin/stats");
      console.log("Full API Response:", res.data);
      setStats(res.data.stats);  // 👈 save only the stats object
    } catch (err) {
      console.error("Error fetching stats:", err.response?.data || err.message);
    }
  };
  fetchStats();
});


  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar */}
      <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
         <div
          className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <span className="text-gray-800">Admin</span>
          <span className="text-[#3A2C99] italic">Panel</span>
        </div>
        <img src={assets.admin} alt="Admin Logo" className="h-10 w-10 object-contain" />
      </nav>

      {/* ✅ Dashboard Content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-center mb-6">
          <img
            src={assets.admin}
            alt="Admin Sticker"
            className="w-32 md:w-48 object-contain mb-4 md:mb-0 md:mr-6"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
            Welcome Back, Admin 👋
          </h2>
        </div>

        {/* ✅ Stats Cards */}
        {stats ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
      <p className="text-3xl font-bold text-indigo-600">{stats.users.total}</p>
    </div>
    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-600">Students</h3>
      <p className="text-3xl font-bold text-green-600">{stats.users.students}</p>
    </div>
    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-600">Owners</h3>
      <p className="text-3xl font-bold text-purple-600">{stats.users.owners}</p>
    </div>
    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-600">Total Properties</h3>
      <p className="text-3xl font-bold text-blue-600">{stats.properties.total}</p>
    </div>
    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-600">Pending</h3>
      <p className="text-3xl font-bold text-red-600">{stats.properties.pending}</p>
    </div>
  </div>
) : (
  <p className="text-gray-600 text-center mt-6">Loading stats...</p>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
