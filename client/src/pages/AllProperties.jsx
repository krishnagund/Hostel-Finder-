import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { FaUser, FaBars } from "react-icons/fa"; // ✅ for profile + hamburger

const AllProperties = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authState, setAuthState] = useState("Login");
  const [favorites, setFavorites] = useState([]);
  const { backendurl, isLoggedin } = useContext(AppContext);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false); // ✅ mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // ✅ profile dropdown
  const profileRef = useRef(null);

  const fetchFavorites = async () => {
    if (!isLoggedin) return;
    try {
      const res = await fetch(`${backendurl}/api/user/favorites`, {
        credentials: "include",
      });
      const data = await res.json();
      setFavorites(data.favorites.map((fav) => fav._id));
    } catch (err) {
      console.error("Error fetching favorites", err);
    }
  };

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
    fetchFavorites();

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoggedin]);

  const handleFavoriteToggle = async (propertyId) => {
    if (!isLoggedin) {
      setAuthState("Login");
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch(`${backendurl}/api/user/favorites/${propertyId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.favorites) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* ===== Navbar ===== */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 shadow-md bg-white relative">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold">
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <span className="text-gray-800">Hostel</span>
          <span className="text-[#3A2C99] italic">Finder</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isLoggedin ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition"
              >
                <FaUser />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md flex flex-col z-30">
                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    My Faves
                  </button>
                  <button
                    onClick={() => {
                      navigate("/saved-searches");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Saved Searches
                  </button>
                  <button
                    onClick={() => {
                      navigate("/inbox");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Inbox
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student-profile");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-md bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition"
              >
                <FaBars />
              </button>

              {/* Desktop Buttons */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => {
                    setAuthState("Sign Up");
                    setShowLoginModal(true);
                  }}
                  className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setAuthState("Login");
                    setShowLoginModal(true);
                  }}
                  className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
                >
                  Log in
                </button>
              </div>

              {/* Mobile Menu */}
              {menuOpen && (
                <div className="absolute top-16 right-4 w-40 bg-white shadow-md rounded-md flex flex-col z-30 sm:hidden">
                  <button
                    onClick={() => {
                      setAuthState("Sign Up");
                      setShowLoginModal(true);
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => {
                      setAuthState("Login");
                      setShowLoginModal(true);
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Log in
                  </button>
                </div>
              )}
            </>
          )}
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
              .map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 relative"
                >
                  {/* Favorite Button */}
                  <div className="absolute top-3 left-3 z-10">
                    <button
                      onClick={() => handleFavoriteToggle(property._id)}
                      className="focus:outline-none bg-white rounded-md p-1 sm:p-2 shadow-md hover:bg-gray-100 transition w-8 sm:w-10"
                    >
                      <span
                        className={`text-xl sm:text-2xl ${
                          favorites.includes(property._id)
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        ♥
                      </span>
                    </button>
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
                    <p className="text-xs sm:text-sm text-gray-700 mb-1">
                      Available from: {property.availabilityDay} {property.availabilityMonth}
                    </p>
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
