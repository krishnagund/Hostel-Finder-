import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import AvailabilityBadge from "../components/AvailabilityBadge";
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";
import LanguageToggle from "../components/LanguageToggle";
import RenterInfo from "../components/RenterInfo";

const AllProperties = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authState, setAuthState] = useState("Login");
  const { backendurl, isLoggedin, logout } = useContext(AppContext);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  
  // Use the custom favorites hook
  const { isFavorited, toggleFavorite } = useFavorites();

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${backendurl}/api/property/all-properties`, {
        credentials: "include",
      });
      const data = await res.json();
      setProperties(data.properties);
    } catch (err) {
      console.error("Error fetching all properties", err);
    }
  };

  useEffect(() => {
    fetchProperties();

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFavoriteToggle = async (propertyId) => {
    if (!isLoggedin) {
      setAuthState("Login");
      setShowLoginModal(true);
      return;
    }

    try {
      await toggleFavorite(propertyId);
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* ===== Navbar ===== */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 shadow-md bg-white">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <span className="text-gray-800">
            <RenterInfo text="Hostel" />
          </span>
          <span className="text-[#3A2C99] italic">
            <RenterInfo text="Finder" />
          </span>
        </div>

        {/* Desktop Navbar Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <LanguageToggle />

          {/* Divider */}
          <div className="h-7 border-l border-[#3A2C99] mx-2" />

          {/* Show Login/Register buttons when not logged in, Profile dropdown when logged in */}
          {!isLoggedin ? (
            <>
              <button
                onClick={() => {
                  setAuthState("Sign Up");
                  setShowLoginModal(true);
                }}
                className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
              >
                Register
              </button>
              <button
                onClick={() => {
                  setAuthState("Login");
                  setShowLoginModal(true);
                }}
                className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
              >
                Log in
              </button>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition z-40"
              >
                <FaUser />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col z-50 border border-gray-200">
                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                  >
                    <RenterInfo text="My Faves" />
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student-profile");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                  >
                    <RenterInfo text="Profile" />
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student-profile?tab=inbox");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                  >
                    <RenterInfo text="Inbox" />
                  </button>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-left text-red-600 w-full transition-colors"
                    >
                      <RenterInfo text="Sign Out" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navbar Right Section */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-[#3A2C99] transition-all duration-300 ease-in-out hover:scale-110"
            >
              {menuOpen ? <FaTimes className="rotate-180 transition-transform duration-300" /> : <FaBars className="transition-transform duration-300" />}
            </button>

            {/* Mobile Dropdown */}
            {menuOpen && (
              <div className="absolute top-full right-0 bg-white shadow-lg rounded-md flex flex-col z-50 border border-gray-200 w-48 mt-2 transition-all duration-300 ease-in-out">
                {/* Language Toggle in Mobile Dropdown */}
                <div className="px-4 py-2 border-b border-gray-200">
                  <LanguageToggle />
                </div>
                
                {!isLoggedin ? (
                  <>
                    <button
                      onClick={() => {
                        setAuthState("Sign Up");
                        setShowLoginModal(true);
                        setMenuOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                    >
                      Register
                    </button>
                    <button
                      onClick={() => {
                        setAuthState("Login");
                        setShowLoginModal(true);
                        setMenuOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/favorites");
                        setMenuOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                    >
                      <RenterInfo text="My Faves" />
                    </button>
                    <button
                      onClick={() => {
                        navigate("/student-profile");
                        setMenuOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                    >
                      <RenterInfo text="Profile" />
                    </button>
                    <button
                      onClick={() => {
                        navigate("/student-profile?tab=inbox");
                        setMenuOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                    >
                      <RenterInfo text="Inbox" />
                    </button>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 text-left text-red-600 w-full transition-colors"
                      >
                        <RenterInfo text="Sign Out" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Properties Section ===== */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-gray-800">
          All Rental Properties
        </h2>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {properties
              .slice(-9)
              .reverse()
              .map((property, index) => (
                <div
                  key={`${property._id}-${index}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 relative"
                >
                  {/* Favorite Button */}
                  <div className="absolute top-3 left-3 z-10">
                    <FavoriteButton
                      propertyId={property._id}
                      isFavorited={isFavorited(property._id)}
                      onToggle={handleFavoriteToggle}
                      size="default"
                    />
                  </div>

                  {/* Image */}
                  {property.roomImages && property.roomImages.length > 0 ? (
                    <img
                      src={
                        typeof property.roomImages[0] === "string"
                          ? property.roomImages[0]
                          : property.roomImages[0]?.url
                      }
                      alt="Property"
                      loading="lazy"
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      No Image Available
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-gray-600 rounded shadow">
                    Posted on{" "}
                    {new Date(property.createdAt).toLocaleDateString("en-US")}
                  </div>

                  <div className="p-4 sm:p-5 text-left">
                    <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                      ₹{new Intl.NumberFormat("en-IN").format(Number(property.rent) || 0)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-1">
                      {(property.properttyType || property.propertyType) || "Other"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-1">
                      {property.city}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs sm:text-sm text-gray-700">
                        Available from: {property.availabilityDay} {property.availabilityMonth}
                      </p>
                      <AvailabilityBadge isAvailable={property.isAvailable} />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-1">
                      Contact: {property.phone}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-1">
                      {property.city}, {property.state}
                    </p>
                    <div className="mt-4 text-right">
                      <button
                        className="text-white bg-[#3A2C99] px-3 sm:px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer text-sm sm:text-base"
                        onClick={() => setSelectedProperty(property)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">No properties found.</p>
        )}
      </section>

      {/* ===== Login Modal ===== */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialState={authState}
      />

      {/* ===== Property Modal ===== */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onRequireAuth={() => {
            setAuthState("Sign Up");
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
};

export default AllProperties;
