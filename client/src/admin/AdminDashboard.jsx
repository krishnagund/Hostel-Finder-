import { useContext, useState} from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

export default function AdminDashboard() {
  const { logout, isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation(); // to check current route
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Check if on main /admin path
  const isBaseAdmin = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 sm:px-8 py-4 shadow-md bg-white relative">
        {/* Logo */}
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

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/admin/stats"
            className={({ isActive }) =>
              `hover:text-[#3A2C99] ${isActive ? "font-semibold text-[#3A2C99]" : ""}`
            }
          >
            Stats
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `hover:text-[#3A2C99] ${isActive ? "font-semibold text-[#3A2C99]" : ""}`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/properties"
            className={({ isActive }) =>
              `hover:text-[#3A2C99] ${isActive ? "font-semibold text-[#3A2C99]" : ""}`
            }
          >
            Properties
          </NavLink>

          {/* Profile / Logout */}
          {isLoggedin && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center text-gray-700 hover:text-[#3A2C99]"
              >
                <FaUserCircle size={28} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 z-20">
                  <p className="px-4 py-2 text-sm text-gray-600 border-b">
                    {userData?.name || "Admin"}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-[#3A2C99]"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full right-0 bg-white shadow-md flex flex-col gap-3 px-6 py-4 w-48 z-20 md:hidden">
            <NavLink
              to="/admin/stats"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#3A2C99]"
            >
              Stats
            </NavLink>
            <NavLink
              to="/admin/users"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#3A2C99]"
            >
              Users
            </NavLink>
            <NavLink
              to="/admin/properties"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#3A2C99]"
            >
              Properties
            </NavLink>

            {isLoggedin && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-red-600 hover:bg-gray-100 py-2 rounded"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 flex items-center justify-center">
        {isBaseAdmin ? (
          <img
            src={assets.admin}
            alt="Admin Sticker"
            className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full h-auto object-contain"
          />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
