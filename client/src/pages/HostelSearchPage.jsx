import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchResultsMap from "../components/SearchResultsMap";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import LoginModal from "./LoginModal";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { Menu, X, User, SlidersHorizontal, Map, List } from "lucide-react";
import AvailabilityBadge from "../components/AvailabilityBadge";
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";
import LanguageToggle from "../components/LanguageToggle";
import RenterInfo from "../components/RenterInfo";

// Utility
const formatINR = (n) => (Number.isFinite(+n) ? new Intl.NumberFormat("en-IN").format(+n) : n);

const typeLabel = (t) => t || "Other";

const FilterChip = ({ active, label, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`px-3 py-2 rounded-lg border text-sm transition ${
      active ? "bg-[#3A2C99] text-white border-[#3A2C99]" : "bg-white border-gray-300 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

const FilterDrawer = ({
  open,
  onClose,
  types,
  selectedTypes,
  onToggleType,
  rentMin,
  rentMax,
  setRentMin,
  setRentMax,
  datasetMin,
  datasetMax,
  onApply,
}) => (
  <>
    {/* Backdrop */}
    <div
      className={`fixed inset-0 bg-black/40 z-[60] transition-opacity ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    />
    {/* Drawer */}
    <div
      className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl p-5 overflow-y-auto transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Filter Results</h3>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Type of Property */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Type of Property</h4>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <FilterChip
              key={t}
              label={typeLabel(t)}
              active={selectedTypes.has(t)}
              onToggle={() => onToggleType(t)}
            />
          ))}
        </div>
      </div>

      {/* Rent Range */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Monthly Rent Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              className="border rounded-md px-3 py-2"
              value={rentMin}
              min={0}
              onChange={(e) => setRentMin(Number(e.target.value))}
              placeholder={datasetMin?.toString() || "0"}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              className="border rounded-md px-3 py-2"
              value={rentMax}
              min={0}
              onChange={(e) => setRentMax(Number(e.target.value))}
              placeholder={datasetMax?.toString() || "100000"}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Dataset range: ₹{formatINR(datasetMin)} – ₹{formatINR(datasetMax)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sticky bottom-0 bg-white pt-3">
        <button
          onClick={() => {
            setRentMin(datasetMin || 0);
            setRentMax(datasetMax || 100000);
            selectedTypes.clear();
            onApply(); // live filter anyway; just close
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          onClick={() => {
            onApply();
          }}
          className="px-5 py-2 rounded-lg bg-[#3A2C99] text-white hover:bg-indigo-700"
        >
          Search
        </button>
      </div>
    </div>
  </>
);

const HostelSearchPage = () => {
  const navigate = useNavigate();
  const { backendurl, isLoggedin, logout } = useContext(AppContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Default Mumbai
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") || "";
  const [authState, setAuthState] = useState("Login");
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Use the custom favorites hook
  const { isFavorited, toggleFavorite } = useFavorites();

  // UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMapOnMobile, setShowMapOnMobile] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);

  // 🔹 Force default to "list" view on mobile when city is searched
  useEffect(() => {
    if (city && window.innerWidth < 768) {
      setShowMapOnMobile(false);
    }
  }, [city]);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [rentMin, setRentMin] = useState(0);
  const [rentMax, setRentMax] = useState(100000);

  const toggleType = (t) =>
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });

  // Fetch once (or on backendurl change)
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = (city || "").trim();
        const url = q
          ? `${backendurl}/api/property/all-properties?q=${encodeURIComponent(q)}`
          : `${backendurl}/api/property/all-properties`;
        let res = await fetch(url);
        let data = await res.json();
        let list = Array.isArray(data?.properties) ? data.properties : [];

        if (list.length === 0 && q) {
          // Fallback: include all statuses to aid debugging/data visibility
          const fallbackUrl = `${backendurl}/api/property/all-properties?all=1&q=${encodeURIComponent(q)}`;
          res = await fetch(fallbackUrl);
          data = await res.json();
          list = Array.isArray(data?.properties) ? data.properties : [];
        }

        // Client-side normalization and prioritization (kept from earlier improvement)
        const normalize = (s = "") => (s || "")
          .toString()
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        const tokens = (s = "") => normalize(s).split(" ").filter(Boolean);
        const initials = (s = "") => tokens(s).map(t => t[0]).join("");

        const needle = normalize(q);
        const byQuery = needle
          ? list.filter((p) => {
              const fields = [p.city, p.state, p.address, p.heading].map((x) => x || "");
              const includesMatch = fields.some((f) => normalize(f).includes(needle));
              if (includesMatch) return true;
              const tokenPrefix = fields.some((f) => tokens(f).some((t) => t.startsWith(needle)));
              if (tokenPrefix) return true;
              const initialsMatch = fields.some((f) => initials(f).startsWith(needle));
              return initialsMatch;
            })
          : list;

        const prioritized = byQuery.sort((a, b) => {
          const aStr = normalize(`${a.city || ''} ${a.state || ''} ${a.address || ''} ${a.heading || ''}`);
          const bStr = normalize(`${b.city || ''} ${b.state || ''} ${b.address || ''} ${b.heading || ''}`);
          const aExact = aStr.split(" ").includes(needle);
          const bExact = bStr.split(" ").includes(needle);
          if (aExact !== bExact) return aExact ? -1 : 1;
          const aStarts = aStr.startsWith(needle);
          const bStarts = bStr.startsWith(needle);
          if (aStarts !== bStarts) return aStarts ? -1 : 1;
          const aTokenStart = aStr.split(" ").some((t) => t.startsWith(needle));
          const bTokenStart = bStr.split(" ").some((t) => t.startsWith(needle));
          if (aTokenStart !== bTokenStart) return aTokenStart ? -1 : 1;
          return aStr.localeCompare(bStr);
        });

        setProperties(prioritized);

        // Center map on first result for query or default if none
        if (prioritized.length) {
          const p0 = prioritized[0];
          const lat = typeof p0.latitude === "string" ? parseFloat(p0.latitude) : p0.latitude;
          const lng = typeof p0.longitude === "string" ? parseFloat(p0.longitude) : p0.longitude;
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            setMapCenter([lat, lng]);
          } else {
            setMapCenter([19.076, 72.8777]); // Default: Mumbai
          }
        } else {
          setMapCenter([19.076, 72.8777]);
        }
      } catch (e) {
        console.error("Failed to load properties", e);
        setMapCenter([19.076, 72.8777]);
      }
    };
    fetchProperties();
  }, [backendurl, city]);

  // Dataset rent range + types for drawer chips
  const datasetStats = useMemo(() => {
    const rents = properties.map((p) => Number(p.rent)).filter((n) => Number.isFinite(n));
    const min = rents.length ? Math.min(...rents) : 0;
    const max = rents.length ? Math.max(...rents) : 100000;
    const types = Array.from(
      new Set(properties.map((p) => p.properttyType || "Other"))
    ).sort();
    return { min, max, types };
  }, [properties]);

  // Keep rent inputs initialized to dataset range whenever dataset changes
  useEffect(() => {
    setRentMin(datasetStats.min);
    setRentMax(datasetStats.max);
  }, [datasetStats.min, datasetStats.max]);

  // Apply filters (live)
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const typeOk = selectedTypes.size
        ? selectedTypes.has(p.properttyType || "Other")
        : true;

      const r = Number(p.rent);
      const rentOk =
        Number.isFinite(r) ? r >= (rentMin ?? 0) && r <= (rentMax ?? Infinity) : true;

      return typeOk && rentOk;
    });
  }, [properties, selectedTypes, rentMin, rentMax]);

  // When selecting a card, track id to open popup
  const [selectedIdForPopup, setSelectedIdForPopup] = useState(null);

  // Dropdown outside close
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    <div className="bg-gray-50 min-h-screen font-sans relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 relative z-50">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold cursor-pointer"
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
                <User className="w-5 h-5" />
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
              {menuOpen ? <X className="w-6 h-6 rotate-180 transition-transform duration-300" /> : <Menu className="w-6 h-6 transition-transform duration-300" />}
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

      {/* Toolbar (filters + mobile toggle) */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 bg-gray-50 border-b border-gray-200">
        <div className="text-sm text-gray-600">
          Showing <b>{filtered.length}</b> results in <b>{city || "All"}</b>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Mobile: toggle map/list */}
          <button
            onClick={() => setShowMapOnMobile((s) => !s)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            {showMapOnMobile ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
            {showMapOnMobile ? "List" : "Map"}
          </button>
        </div>
      </div>

      {/* Main two-pane layout */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-130px)] bg-gray-50 relative z-0">
        {/* Map (hidden on mobile when list is active) */}
        <div className={`w-full md:w-[60%] ${showMapOnMobile ? "block" : "hidden md:block"} p-4 sm:p-6`}>
          <SearchResultsMap
            center={mapCenter}
            properties={filtered}
            selectedPropertyId={selectedIdForPopup}
            onMarkerClick={(p) => {
              setSelectedIdForPopup(p._id);
            }}
          />
        </div>

        {/* Results list */}
        <div className="w-full md:w-[40%] h-full overflow-y-auto px-4 sm:px-8 py-6 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
            Hostels in {city || "Selected Area"}
          </h2>

          {filtered.length > 0 ? (
            <div className="space-y-6">
              {filtered.map((property, index) => (
                <div
                  key={`${property._id}-${index}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-[1.01] relative"
                >
                  <img
                    src={property.roomImages?.[0] || assets.no_img}
                    alt="Property"
                    className="w-full h-56 object-cover"
                  />
                  
                  {/* Favorite Button */}
                  <div className="absolute top-4 left-4 z-10">
                    <FavoriteButton
                      propertyId={property._id}
                      isFavorited={isFavorited(property._id)}
                      onToggle={handleFavoriteToggle}
                      size="default"
                    />
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-medium text-gray-600 rounded shadow">
                    {property.createdAt
                      ? `Posted on ${new Date(property.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : ""}
                  </div>
                  <div className="p-4 text-left">
                    <p className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                      ₹{formatINR(property.rent)}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      {(property.properttyType || property.propertyType) || "Other"}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">{property.city}</p>
                    <p className="text-sm text-gray-700 mb-1">
                      Available from: {property.availabilityDay} {property.availabilityMonth}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">Contact: {property.phone}</p>
                    <p className="text-sm text-gray-700 mb-1">
                      {property.city}, {property.state}
                    </p>

                    {/* Availability Badge above Details Button */}
                    <div className="mt-4 mb-3 flex justify-end">
                      <AvailabilityBadge isAvailable={property.isAvailable} />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="px-4 py-2 rounded-lg bg-[#3A2C99] text-white hover:bg-indigo-700 transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No hostels found in this area.</p>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        types={datasetStats.types}
        selectedTypes={selectedTypes}
        onToggleType={toggleType}
        rentMin={rentMin}
        rentMax={rentMax}
        setRentMin={setRentMin}
        setRentMax={setRentMax}
        datasetMin={datasetStats.min}
        datasetMax={datasetStats.max}
        onApply={() => setShowFilters(false)}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          initialState={authState}
        />
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default HostelSearchPage;

