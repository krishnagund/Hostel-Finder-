import { useContext, useState} from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // to check current route

  // Check if on main /admin path
  const isBaseAdmin = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Shared Admin Navbar */}
      <AdminNavbar />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6">
        {isBaseAdmin ? (
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="flex flex-col md:flex-row items-center justify-center mb-6">
                <img
                  src={assets.admin}
                  alt="Admin Sticker"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 object-contain mb-4 md:mb-0 md:mr-6"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Welcome Back, Admin 👋
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Manage your hostel finder platform efficiently
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-indigo-600">📊</div>
                <div className="text-sm text-gray-600 mt-1">Analytics</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">👥</div>
                <div className="text-sm text-gray-600 mt-1">Users</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">🏠</div>
                <div className="text-sm text-gray-600 mt-1">Properties</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-purple-600">⚙️</div>
                <div className="text-sm text-gray-600 mt-1">Settings</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/admin/stats')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">📈</div>
                <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                <p className="text-sm opacity-90">Check platform statistics and insights</p>
              </button>
              
              <button
                onClick={() => navigate('/admin/users')}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
                <p className="text-sm opacity-90">Control user accounts and permissions</p>
              </button>
              
              <button
                onClick={() => navigate('/admin/properties')}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">🏠</div>
                <h3 className="text-lg font-semibold mb-2">Review Properties</h3>
                <p className="text-sm opacity-90">Approve and manage property listings</p>
              </button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
