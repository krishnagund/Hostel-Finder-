import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import Navbar from "../components/Navbar"; // optional if you move the navbar out
import { assets } from "../assets/assets";

const AllProperties = () => {
  const { backendurl } = useContext(AppContext);
  const [properties, setProperties] = useState([]);

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
  }, []);

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
        <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">
          My Faves
        </button>
        <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">
          Saved Searches
        </button>
    
        {/* Vertical Divider */}
        <div className="h-7 border-1 border-[#3A2C99] mx-2"></div>
    
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
    </nav>
    <div>

      <section className="px-6 py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">All Rental Properties</h2>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 relative"
              >
                <img
                  src={
                    property.image ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Property"
                  className="w-full h-56 object-cover"
                />

                <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-medium text-gray-600 rounded shadow">
                  Posted on {new Date(property.createdAt).toLocaleDateString("en-US")}
                </div>

                <div className="p-5 text-left">
                  <p className="text-xl font-semibold text-gray-800 mb-1">
                    ₹{property.rent}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">{property.propertyType || "Room"}</p>
                  <p className="text-sm text-gray-700 mb-1">
                    2bd • 1ba • {property.area || "800"} ft²
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    ID {property._id.slice(-5).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-800">
                    {property.city}, {property.state}
                  </p>
                   <div className="mt-4 text-right">
              <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">
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
    </div>
    </div>
  );
};

export default AllProperties;
