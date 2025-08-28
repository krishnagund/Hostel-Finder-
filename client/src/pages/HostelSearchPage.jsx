import { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchResultsMap from "../components/SearchResultsMap";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import LoginModal from "./LoginModal";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { Menu, X, User } from "lucide-react";

const HostelSearchPage = () => {
  const navigate = useNavigate();
  const { backendurl, isLoggedin } = useContext(AppContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Default Mumbai
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const [authState, setAuthState] = useState("Login");
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Dropdown states
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${backendurl}/api/property/all-properties`);
        const data = await response.json();

        const filtered = city
          ? data.properties.filter((p) =>
              p.city.toLowerCase().includes(city.toLowerCase())
            )
          : data.properties;

        setProperties(filtered);

        if (filtered.length > 0) {
          setMapCenter([filtered[0].latitude, filtered[0].longitude]);
        }
      } catch (error) {
        console.error("Failed to load properties", error);
      }
    };

    fetchProperties();
  }, [city, backendurl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 shadow-md bg-white relative z-50">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-2xl font-bold cursor-pointer"
        >
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-gray-800">Hostel</span>
          <span className="text-[#3A2C99] italic">Finder</span>
        </div>

        {/* Right Side */}
        <div className="relative z-50" ref={dropdownRef}>
          {isLoggedin ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <User className="w-6 h-6 text-gray-700" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl py-2 z-50">
                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Faves
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Saved Searches
                  </button>
                  <button
                    onClick={() => {
                      navigate("/inbox");
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Inbox
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student-profile");
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md border border-gray-300 md:hidden"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Desktop buttons */}
              <div className="hidden md:flex gap-3">
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
              </div>

              {/* Mobile dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl py-2 z-50 md:hidden">
                  <button
                    onClick={() => {
                      setAuthState("Sign Up");
                      setShowLoginModal(true);
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => {
                      setAuthState("Login");
                      setShowLoginModal(true);
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Log in
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)] bg-gray-50 relative z-0">
        {/* Map */}
        <div className="w-full lg:w-[60%] h-80 lg:h-full relative z-0">
          <SearchResultsMap center={mapCenter} properties={properties} />
        </div>

        {/* Results */}
        <div className="w-full lg:w-[40%] h-full overflow-y-auto px-4 py-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
            Hostels in {city}
          </h2>

          {properties.length > 0 ? (
            <div className="space-y-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-[1.01] relative"
                >
                  <img
                    src={property.roomImages[0]}
                    alt="Property"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-medium text-gray-600 rounded shadow">
                    Posted on{" "}
                    {new Date(property.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="p-4 text-left">
                    <p className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                      ₹{property.rent}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {property.properttyType}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      {property.address}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      Available from: {property.availabilityDay}{" "}
                      {property.availabilityMonth}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      Contact: {property.phone}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      {property.city}, {property.state}
                    </p>
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-white hover:text-black border hover:border-indigo-600 transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No listings found.</p>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialState={authState}
      />

      {/* Property Details Modal */}
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

export default HostelSearchPage;
