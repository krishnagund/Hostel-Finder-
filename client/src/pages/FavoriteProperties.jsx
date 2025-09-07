import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../context/Appcontext";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import PropertyDetailsModal from "./PropertyDetailsModal";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText";
import LanguageToggle from "../components/LanguageToggle";
import AvailabilityBadge from "../components/AvailabilityBadge";
import { FaUser } from "react-icons/fa";

const FavoriteProperties = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { backendurl, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${backendurl}/api/user/favorites`, {
        credentials: "include",
      });
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

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

          {/* Profile Dropdown Toggle */}
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
                  className="px-4 py-2 hover:bg-gray-100 text-left bg-blue-50 transition-colors"
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
        </div>

        {/* Mobile Navbar Right Section */}
        <div className="md:hidden flex items-center gap-2">
          <div className="relative" ref={mobileProfileRef}>
            <button
              onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition z-40"
            >
              <FaUser size={16} />
            </button>

            {mobileProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col z-50 border border-gray-200">
                {/* Language Toggle in Mobile Dropdown */}
                <div className="px-4 py-2 border-b border-gray-200">
                  <LanguageToggle />
                </div>
                
                <button
                  onClick={() => {
                    navigate("/favorites");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left bg-blue-50 transition-colors"
                >
                  <RenterInfo text="My Faves" />
                </button>
                <button
                  onClick={() => {
                    navigate("/student-profile");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Profile" />
                </button>
                <button
                  onClick={() => {
                    navigate("/student-profile?tab=inbox");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Inbox" />
                </button>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      logout();
                      setMobileProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left text-red-600 w-full transition-colors"
                  >
                    <RenterInfo text="Sign Out" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Page Title ===== */}
      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          <RenterInfo text="My Favorite Properties" />
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">❤️</div>
            <p className="text-gray-600 text-lg mb-2">
              <RenterInfo text="You haven't favorited any properties yet" />
            </p>
            <p className="text-gray-500 text-sm">
              <RenterInfo text="Start exploring properties and add them to your favorites" />
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 relative"
              >
                {/* Property Image */}
                {property.roomImages && property.roomImages.length > 0 ? (
                  <img
                    src={
                      typeof property.roomImages[0] === "string"
                        ? property.roomImages[0].startsWith("http")
                          ? property.roomImages[0]
                          : `${backendurl}/uploads/${property.roomImages[0]}`
                        : property.roomImages[0]?.url
                    }
                    alt="Property"
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    <RenterInfo text="No Image Available" />
                  </div>
                )}

                {/* Posted Date */}
                <div className="absolute top-3 right-3 bg-white px-2 py-1 text-xs font-medium text-gray-600 rounded shadow">
                  <RenterInfo text="Posted on" />{" "}
                  {new Date(property.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Property Details */}
                <div className="p-4 sm:p-5 text-left">
                  <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                    ₹{new Intl.NumberFormat("en-IN").format(Number(property.rent) || 0)}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <TranslatedText text={(property.properttyType || property.propertyType) || "Other"} />
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <TranslatedText text={property.city} />
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-700">
                      <RenterInfo text="Available from:" />{" "}
                      <TranslatedText text={`${property.availabilityDay} ${property.availabilityMonth}`} />
                    </p>
                    <AvailabilityBadge isAvailable={property.isAvailable} />
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <RenterInfo text="Contact:" /> {property.phone}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <TranslatedText text={`${property.city}, ${property.state}`} />
                  </p>
                  
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
                    >
                      <RenterInfo text="View Details" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Modal ===== */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default FavoriteProperties;
