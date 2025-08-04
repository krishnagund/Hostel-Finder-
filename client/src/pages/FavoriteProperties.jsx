import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
const FavoriteProperties = () => {
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const { backendurl, isLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

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
              <nav className="flex justify-between items-center px-8 py-6 shadow-md bg-white">
                {/* Logo */}
                <div className="flex items-center space-x-2 text-3xl font-bold">
                  <img src={assets.logo1} alt="Hostel Finder Logo" className="h-18 w-18 object-contain" />
                  <span className="text-gray-800">Hostel</span>
                  <span className="text-[#3A2C99] italic">Finder</span>
                </div>
        
                {/* Navbar Buttons */}
                <div className="flex items-center gap-3">
                  <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">Saved Searches</button>
        
                  <div className="h-7 border-1 border-[#3A2C99] mx-2" />
        
                  <button onClick={() => navigate("/inbox")} className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">Inbox</button>
                  <button onClick={() => navigate("/student-profile")} className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">Profile</button>
                </div>
              </nav>
             <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Favorite Properties</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-600">You haven’t favorited any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div key={property._id} className="bg-white rounded shadow p-4 relative">
              <img
  src={
    property.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  }
  alt="property"
  className="w-full h-48 object-cover rounded"
/>
              <h2 className="text-xl font-semibold mt-2">₹{property.rent}</h2>
              <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
              <p className="text-sm text-gray-500 mt-1">{property.propertyType}</p>
              <button
                onClick={() => navigate(`/property/${property._id}`)}
                className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default FavoriteProperties;
