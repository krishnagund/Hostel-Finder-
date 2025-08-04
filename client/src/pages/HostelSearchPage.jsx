import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import SearchResultsMap from "../components/SearchResultsMap";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";


const HostelSearchPage = () => {
  const navigate = useNavigate();
  const { backendurl } = useContext(AppContext);
   const [showLoginModal, setShowLoginModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Mumbai default
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const [authState, setAuthState] = useState("Login");
  const { isLoggedin,userData } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
     <div className="bg-gray-50 min-h-screen font-sans">
          {/* Navbar */}
          <nav className="flex justify-between items-center px-8 py-6 shadow-md bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-2 text-3xl font-bold">
        <img src={assets.logo1} alt="Hostel Finder Logo" className="h-18 w-18 object-contain" />
        <span className="text-gray-800">Hostel</span>
        <span className="text-[#3A2C99] italic">Finder</span>
      </div>
    
      {/* Right-side buttons: Faves, Searches, Register, Login */}
  <div className="flex items-center gap-3">
  {isLoggedin ? (
    <>
      <button onClick={() => navigate("/favorites")} className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">
        My Faves
      </button>
      <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">
        Saved Searches
      </button>

      <div className="h-7 border-1 border-[#3A2C99] mx-2" />

      <button
        onClick={() => navigate("/inbox")}
        className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
      >
        Inbox
      </button>
      <button
        onClick={() => navigate("/student-profile")}
        className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
      >
        Profile
      </button>
    </>
  ) : (
    <>
      <div className="h-7 border-1 border-[#3A2C99] mx-2" />

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
    </>
  )}
</div>

    </nav>
    <div className="flex h-screen bg-gray-50">
      {/* Map - 60% */}
      <div className="w-full lg:w-[60%] h-full">
        <SearchResultsMap center={mapCenter} properties={properties} />
      </div>

      {/* Results - 40% */}
      <div className="w-full lg:w-[40%] h-full overflow-y-auto px-6 py-10 bg-white border-l border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
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
                  src={
                    property.image ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Property"
                  className="w-full h-48 object-cover"
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
                  <p className="text-xl font-semibold text-gray-800 mb-1">
                    ₹{property.rent}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    {property.propertyType || "Room"}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    2bd • 1ba • {property.area || "800"} ft² • Pets Ok
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    ID {property._id.slice(-5).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-800">
                    {property.city}, {property.state}
                  </p>
                  <div className="mt-4 text-right">
                    <button className="text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-white hover:text-black border hover:border-indigo-600 transition cursor-pointer">
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
    <div>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialState={authState}
      />
    </div>
    </div>
    
    
  );
};

export default HostelSearchPage;
