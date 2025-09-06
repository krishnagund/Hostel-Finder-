import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchResultsMap from "../components/SearchResultsMap";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import LoginModal from "./LoginModal";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { Menu, X, User, SlidersHorizontal, Map, List } from "lucide-react";
import AvailabilityBadge from "../components/AvailabilityBadge";

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
  const { backendurl, isLoggedin } = useContext(AppContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Default Mumbai
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") || "";
  const [authState, setAuthState] = useState("Login");
  const [selectedProperty, setSelectedProperty] = useState(null);

  // UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMapOnMobile, setShowMapOnMobile] = useState(true);

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
        const res = await fetch(`${backendurl}/api/property/all-properties`);
        const data = await res.json();
        const list = Array.isArray(data?.properties) ? data.properties : [];

        // Filter by city first (query param)
        const byCity = city
          ? list.filter(
              (p) =>
                (p.city && p.city.toLowerCase().includes(city.toLowerCase())) ||
                (p.state && p.state.toLowerCase().includes(city.toLowerCase())) ||
                (p.address && p.address.toLowerCase().includes(city.toLowerCase()))
            )
          : list;

        setProperties(byCity);

        // Center map on first result for city
        if (byCity.length) {
          const p0 = byCity[0];
          const lat =
            typeof p0.latitude === "string" ? parseFloat(p0.latitude) : p0.latitude;
          const lng =
            typeof p0.longitude === "string" ? parseFloat(p0.longitude) : p0.longitude;
          if (Number.isFinite(lat) && Number.isFinite(lng)) setMapCenter([lat, lng]);
        }
      } catch (e) {
        console.error("Failed to load properties", e);
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
  const dropdownRef = useRef(null);
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
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-gray-50 relative z-50">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-2xl font-bold cursor-pointer"
        >
          <img src={assets.logo1} alt="Hostel Finder Logo" className="h-12 w-12 object-contain" />
          <span className="text-gray-800">Hostel</span>
          <span className="text-[#3A2C99] italic">Finder</span>
        </div>

        {/* Right */}
        <div className="relative z-50" ref={dropdownRef}>
          {isLoggedin ? (
            <>
              <button
                onClick={() => setMenuOpen((s) => !s)}
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
                      navigate("/student-profile?tab=inbox");
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
                onClick={() => setMenuOpen((s) => !s)}
                className="p-2 rounded-md border border-gray-300 md:hidden"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
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

      {/* Toolbar (filters + mobile toggle) */}
      <div className="flex items-center justify-between px-4 md:px-12 py-3 bg-white border-b">
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
        <div className={`w-full md:w-[60%] ${showMapOnMobile ? "block" : "hidden md:block"} p-3`}>
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
        <div className="w-full md:w-[40%] h-full overflow-y-auto px-4 py-6 bg-white border-t md:border-t-0 md:border-l border-gray-200 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
            Hostels in {city || "Selected Area"}
          </h2>

          {filtered.length > 0 ? (
            <div className="space-y-6">
              {filtered.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-[1.01] relative"
                >
                  <img
                    src={property.roomImages?.[0] || assets.no_img}
                    alt="Property"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-medium text-gray-600 rounded shadow">
                    {property.createdAt
                      ? `Posted on ${new Date(property.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : ""}
                  </div>
                  <div className="absolute top-4 right-4">
                    <AvailabilityBadge isAvailable={property.isAvailable} />
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

                                        <div className="mt-4 flex items-center justify-end gap-3">
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

