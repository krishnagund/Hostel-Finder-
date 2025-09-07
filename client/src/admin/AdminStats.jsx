import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import api from "../utils/axiosInstance";
import AdminNavbar from "../components/AdminNavbar";

const AdminStats = () => {
  const { backendurl } = useContext(AppContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(backendurl + "/api/admin/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching stats:", err.response?.data || err.message);
      }
    };
    fetchStats();
  }, [backendurl]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Admin Navbar */}
      <AdminNavbar />

      {/* Dashboard Content */}
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Platform Analytics 📊
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Overview of your hostel finder platform performance
            </p>
          </div>

          {/* Stats Cards */}
          {stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Total Users */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">
                  {stats.users.total}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-1">
                  Total Users
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Registered platform users
                </p>
              </div>

              {/* Students */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stats.users.students}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-1">
                  Students
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Looking for accommodation
                </p>
              </div>

              {/* Owners */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                  {stats.users.owners}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-1">
                  Property Owners
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Listing their properties
                </p>
              </div>

              {/* Total Properties */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  {stats.properties.total}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-1">
                  Total Properties
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  All property listings
                </p>
              </div>

              {/* Pending Properties */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-2">
                  {stats.properties.pending}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-1">
                  Pending Review
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Awaiting approval
                </p>
              </div>

              {/* Approved Properties */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stats.properties.approved}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-1">
                  Approved Properties
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Live and visible
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A2C99] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          )}

          {/* Additional Info Cards */}
          {stats && (
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* User Distribution */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Students</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(stats.users.students / stats.users.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Math.round((stats.users.students / stats.users.total) * 100)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Owners</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(stats.users.owners / stats.users.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Math.round((stats.users.owners / stats.users.total) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Status */}
              <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(stats.properties.approved / stats.properties.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Math.round((stats.properties.approved / stats.properties.total) * 100)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(stats.properties.pending / stats.properties.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Math.round((stats.properties.pending / stats.properties.total) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
