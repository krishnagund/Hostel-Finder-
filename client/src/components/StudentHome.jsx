import { useContext, useState, useEffect,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import PropertyDetailsModal from "../pages/PropertyDetailsModal";
import LoginModal from "../pages/LoginModal";
import StatsSection from "./StatsSection";
import TopCities from "./TopCities";
import RenterInfo from "./RenterInfo";
import { useLanguage } from "../context/LanguageContext";
import TranslatedText from "./TranslatedText";
import LanguageToggle from "./LanguageToggle";
import AvailabilityBadge from "./AvailabilityBadge";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";
import { FaUser } from "react-icons/fa"; // ✅ Import profile icon
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const StudentHome = () => {
  
  const navigate = useNavigate();
  const { userData, backendurl, isLoggedin, logout } = useContext(AppContext);
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const { language, setLanguage } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false); 
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authState, setAuthState] = useState("Login");
  
  // Use the custom favorites hook
  const { isFavorited, toggleFavorite } = useFavorites();

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


  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };


const fetchUnreadCount = async () => {
  if (!isLoggedin) return;
  try {
    const res = await fetch(`${backendurl}/api/messages/unread-count`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      setUnreadCount(data.unreadCount);
    }
  } catch (err) {
    console.error("Error fetching unread count", err);
  }
};

// Function to update unread count when messages are read
const updateUnreadCount = (newCount) => {
  setUnreadCount(newCount);
};

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${backendurl}/api/property/all-properties`, {
        credentials: "include",
      });
      const data = await response.json();
      setProperties(data.properties);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchUnreadCount();
  }, [isLoggedin]);

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
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 bg-gray-50">
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
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="My Faves" />
                </button>
                <button
                  onClick={() => {
                    navigate("/saved-searches");
                    setProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  Saved Searches
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
                  className="px-4 py-2 hover:bg-gray-100 text-left flex justify-between items-center transition-colors"
                >
                  <RenterInfo text="Inbox" />
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
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
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="My Faves" />
                </button>
                <button
                  onClick={() => {
                    navigate("/saved-searches");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  Saved Searches
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
                  className="px-4 py-2 hover:bg-gray-100 text-left flex justify-between items-center transition-colors"
                >
                  <RenterInfo text="Inbox" />
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
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


      {/* ===== Hero Section ===== */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-20 sm:py-32 px-4 sm:px-12"
        style={{ backgroundImage: `url(${assets.hostel})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 text-center text-white max-w-2xl sm:max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            <RenterInfo text="Find Affordable Hostels Near Your College" />
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-8">
            <RenterInfo text="Search verified listings and connect directly with hostel owners." />
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search city or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (searchQuery || "").trim();
                  if (!q) {
                    toast.error("Please type a city or college name");
                    return;
                  }
                  navigate(`/hostels?city=${encodeURIComponent(q)}`);
                }
              }}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                const q = (searchQuery || "").trim();
                if (!q) {
                  toast.error("Please type a city or college name");
                  return;
                }
                navigate(`/hostels?city=${encodeURIComponent(q)}`);
              }}
              className="bg-[#3A2C99] text-white px-4 sm:px-5 py-2 sm:py-3 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
            >
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* ===== Tagline ===== */}
      <section className="text-center bg-white mt-8 sm:mt-10 px-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-black leading-snug drop-shadow-md">
          <RenterInfo text="Find a room," />
          <br />
          <span className="text-black-300">
            <RenterInfo text="Rent a room" />&nbsp;
          </span>
          <span className="text-[#3A2C99] italic inline-block relative">
            <RenterInfo text="faster!" />
            <svg
              className="absolute left-0 -bottom-3 w-full h-4"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0,7 C20,14 80,0 100,7"
                stroke="#3A2C99"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </span>
        </h1>
      </section>

      <StatsSection />

      {/* ===== Recently Added ===== */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-gray-800">
          <RenterInfo text="Recently Added" />
        </h2>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {properties.slice(0, 3).map((property, index) => (
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
                    <RenterInfo text="No Image Available" />
                  </div>
                )}

                {/* Posted Date */}
                <div className="absolute top-3 right-3 bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-gray-600 rounded shadow">
                  <RenterInfo text="Posted on" />{" "}
                  {new Date(property.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Property Info */}
                <div className="p-4 sm:p-5 text-left">
                  <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                    ₹<TranslatedText text={property.rent} />
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    <TranslatedText text={property.properttyType} />
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 mb-1">
                    <TranslatedText text={property.address} />
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <RenterInfo text="Available from:" />{" "}
                      <TranslatedText text={property.availabilityDay} />{" "}
                      <TranslatedText text={property.availabilityMonth} />
                    </p>
                    <AvailabilityBadge isAvailable={property.isAvailable} />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-1">
                    <RenterInfo text="Contact:" />{" "}
                    <TranslatedText text={property.phone} />
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 mb-1">
                    <TranslatedText text={property.city} />,{" "}
                    <TranslatedText text={property.state} />
                  </p>

                  <div className="mt-4 text-right">
                                         <button
                       onClick={() => setSelectedProperty(property)}
                       className="text-white bg-[#3A2C99] px-3 sm:px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer text-sm sm:text-base"
                     >
                      <RenterInfo text="Details" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            <RenterInfo text="No recent listings found." />
          </p>
        )}

        {/* See All Button */}
        <div className="mt-10 sm:mt-12">
          <Link
  to="/all-properties"
  className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
>
  <RenterInfo text="See All New Rental Properties" />
</Link>
        </div>

        <div className="mt-8">
          <TopCities />
        </div>
      </section>

      {/* Property Modal */}
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialState={authState}
      />
    </div>
  );
};

export default StudentHome;
