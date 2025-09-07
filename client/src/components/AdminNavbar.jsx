import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import { FaBars, FaTimes, FaUserCircle, FaBell } from "react-icons/fa";
import api from "../utils/axiosInstance";

const AdminNavbar = () => {
  const { logout, isLoggedin, userData, backendurl } = useContext(AppContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [notificationSeen, setNotificationSeen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const { data } = await api.get(`${backendurl}/api/admin/notifications/count`);
        if (data.success) {
          setPendingCount(data.notificationCount);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };
    fetchNotificationCount();
    
    // Refresh notification count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [backendurl]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.profile-button')) {
        setProfileOpen(false);
      }
      if (!event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async () => {
    setNotificationSeen(true);
    try {
      await api.put(`${backendurl}/api/admin/notifications/mark-seen`);
      setPendingCount(0);
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
    }
    navigate('/admin/properties');
  };

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 text-xl sm:text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-8 w-8 sm:h-12 sm:w-12 object-contain"
          />
          <span className="text-gray-800">Admin</span>
          <span className="text-[#3A2C99] italic">Panel</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <NavLink
            to="/admin/stats"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-[#3A2C99] text-white" 
                  : "text-gray-600 hover:text-[#3A2C99] hover:bg-gray-100"
              }`
            }
          >
            Stats
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-[#3A2C99] text-white" 
                  : "text-gray-600 hover:text-[#3A2C99] hover:bg-gray-100"
              }`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/properties"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                isActive 
                  ? "bg-[#3A2C99] text-white" 
                  : "text-gray-600 hover:text-[#3A2C99] hover:bg-gray-100"
              }`
            }
          >
            Properties
            {pendingCount > 0 && !notificationSeen && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </NavLink>

          {/* Notification Bell */}
          {pendingCount > 0 && !notificationSeen && (
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 hover:text-[#3A2C99] transition-colors"
              title="New pending properties"
            >
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingCount}
              </span>
            </button>
          )}

          {/* Profile Dropdown */}
          {isLoggedin && (
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="profile-button flex items-center text-gray-700 hover:text-[#3A2C99] transition-colors"
              >
                <FaUserCircle size={24} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-20 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-800">
                      {userData?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-button text-2xl text-[#3A2C99] p-2"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu absolute top-full left-0 right-0 bg-white shadow-lg border-t md:hidden">
          <div className="px-4 py-2 space-y-1">
            <NavLink
              to="/admin/stats"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-gray-600 hover:text-[#3A2C99] hover:bg-gray-100 transition-colors"
            >
              Stats
            </NavLink>
            <NavLink
              to="/admin/users"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-gray-600 hover:text-[#3A2C99] hover:bg-gray-100 transition-colors"
            >
              Users
            </NavLink>
            <NavLink
              to="/admin/properties"
              onClick={() => {
                setMenuOpen(false);
                setNotificationSeen(true);
              }}
              className="block px-3 py-2 rounded-lg text-gray-600 hover:text-[#3A2C99] hover:bg-gray-100 transition-colors relative"
            >
              Properties
              {pendingCount > 0 && !notificationSeen && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {pendingCount} new
                </span>
              )}
            </NavLink>

            {/* Mobile Profile Section */}
            {isLoggedin && (
              <div className="border-t pt-2 mt-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-800">
                    {userData?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">{userData?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
