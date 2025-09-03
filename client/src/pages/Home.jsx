import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import LoginModal from "./LoginModal";
import { AppContext } from "../context/Appcontext";
import PropertyDetailsModal from "./PropertyDetailsModal";
import StatsSection from "../components/StatsSection";
import CTASection from "../components/CTASection";
import TopCities from "../components/TopCities";
import { useLanguage } from "../context/LanguageContext";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText";
import LanguageToggle from "../components/LanguageToggle";

import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authState, setAuthState] = useState("Login");
  const { isLoggedin, userData, backendurl } = useContext(AppContext);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

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
    if (isLoggedin) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isLoggedin]);

  const handleFavoriteToggle = async (propertyId) => {
    if (!isLoggedin) {
      setAuthState("Login");
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch(
        `${backendurl}/api/user/favorites/${propertyId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

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
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 sm:px-8 py-4 shadow-md bg-white relative">
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
          <span className="text-gray-800">Hostel</span>
          <span className="text-[#3A2C99] italic">Finder</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <div className="h-6 border-l border-[#3A2C99] mx-2"></div>
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
            <>
              <Link
                to="/inbox"
                className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
              >
                Messages
              </Link>
            </>
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
            <LanguageToggle />
            {!isLoggedin ? (
              <>
                <button
                  onClick={() => {
                    setAuthState("Sign Up");
                    setShowLoginModal(true);
                    setMenuOpen(false);
                  }}
                  className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setAuthState("Login");
                    setShowLoginModal(true);
                    setMenuOpen(false);
                  }}
                  className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/inbox"
                  className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-24 sm:py-32 px-4 sm:px-12"
        style={{ backgroundImage: `url(${assets.hostel})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            <RenterInfo text="Find Affordable Hostels Near Your College" />
          </h1>
          <p className="text-base sm:text-lg mb-8">
            <RenterInfo text="Search verified listings and connect directly with hostel owners." />
          </p>

          {/* Search Bar */}
         <div className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-lg mx-auto">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        navigate(`/hostels?city=${encodeURIComponent(searchQuery)}`);
      }
    }}
    placeholder={
      language === "en"
        ? "Search city or college..."
        : "शहर या कॉलेज खोजें..."
    }
    className="w-full px-4 py-3 bg-white text-black rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
  <button
    onClick={() =>
      navigate(`/hostels?city=${encodeURIComponent(searchQuery)}`)
    }
    className="bg-[#3A2C99] text-white px-5 py-3 rounded-md hover:bg-white hover:text-black transition"
  >
    🔍
  </button>
</div>

        </div>
      </section>

      {/* Tagline */}
      <section className="text-center bg-white">
        <div className="mt-10 px-4">
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
        </div>
      </section>

      <StatsSection />

      {/* Recently Added */}
      <section className="px-4 sm:px-6 py-16 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-800">
          Recently Added
        </h2>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {properties.slice(0, 3).map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 relative"
              >
                {/* Favorite */}
                <div className="absolute top-4 left-4 z-10">
                  <button
                    onClick={() => handleFavoriteToggle(property._id)}
                    className="focus:outline-none bg-white rounded-md p-2 shadow-md hover:bg-gray-100 transition w-10"
                  >
                    <span
                      className={`text-2xl ${
                        !isLoggedin || !favorites.includes(property._id)
                          ? "text-gray-400"
                          : "text-red-500"
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
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Image Available
                  </div>
                )}

                {/* Date */}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-medium text-gray-600 rounded shadow">
                  Posted on{" "}
                  {new Date(property.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Info */}
                <div className="p-5 text-left">
                  <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                    ₹{property.rent}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <TranslatedText text={property.propertyType} />
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <TranslatedText text={property.address} />
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <RenterInfo text="Available from:" />{" "}
                    <TranslatedText
                      text={`${property.availabilityDay} ${property.availabilityMonth}`}
                    />
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <RenterInfo text="Phone:" /> {property.phone}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <TranslatedText
                      text={`${property.city}, ${property.state}`}
                    />
                  </p>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
                    >
                      <RenterInfo text="Details" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent listings found.</p>
        )}

        {/* See All */}
        <div className="mt-12">
        <Link
  to="/all-properties"
  className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
>
  <RenterInfo text="See All New Rental Properties" />
</Link>
        </div>

        <div className="mt-10">
          <TopCities />
        </div>
      </section>

      <CTASection
        onListProperty={() => {
          if (isLoggedin) {
            navigate("/owner-home");
          } else {
            setAuthState("Sign Up");
            setShowLoginModal(true);
          }
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialState={authState}
      />

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

export default Home;
