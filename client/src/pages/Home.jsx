import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import LoginModal from "./LoginModal";
import { useContext } from "react";
import { AppContext } from "../context/Appcontext";


const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authState, setAuthState] = useState("Login"); // 'Login' or 'Sign Up'
  const { isLoggedin,userData } = useContext(AppContext);
  const [properties, setProperties] = useState([]);
  const { backendurl } = useContext(AppContext);

  const navigate = useNavigate();

    const fetchProperties = async () => {
  try {
    const response = await fetch(`${backendurl}/api/property/all-properties`, {
      credentials: 'include', // <== important!
    });
    const data = await response.json();
    setProperties(data.properties);
  } catch (err) {
    console.error("Failed to fetch properties", err);
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


      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-32 px-6 sm:px-12"
        style={{ backgroundImage: `url(${assets.hostel})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find Affordable Hostels Near Your College
          </h1>
          <p className="text-lg mb-8">Search verified listings and connect directly with hostel owners.</p>

          {/* Search Bar */}
          <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search city or college..."
              className="w-full max-w-3xl px-6 py-3 bg-white text-black rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => navigate("/hostels")}
              className="bg-[#3A2C99] text-white px-5 py-3 rounded-md hover:bg-white hover:text-black transition"
            >
              🔍
            </button>
          </div>
        </div>
      </section>

     {/* tagline */}

   <section className="text-center bg-white">
  <div className="text-center mt-10">
    <h1 className="text-6xl md:text-7xl font-extrabold text-black leading-snug drop-shadow-md">
      Find a room,<br />
      <span className="text-black-300">Rent a room&nbsp;</span>
      <span className="text-[#3A2C99] italic inline-block relative">
        faster!
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



{/*Recently ADDED*/}

  <section className="px-6 py-16 bg-white text-center">
  <h2 className="text-3xl font-bold mb-10 text-gray-800">Recently Added</h2>

  {properties && properties.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {properties.slice(0, 3).map((property) => (
        <div
          key={property._id}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105 relative"
        >
          {/* Image */}
          <img
            src={
              property.image ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            }
            alt="Property"
            className="w-full h-56 object-cover"
          />

          {/* Posted Date Overlay */}
          <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-medium text-gray-600 rounded shadow">
            Posted on {new Date(property.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* Property Info */}
          <div className="p-5 text-left">
            <p className="text-xl font-semibold text-gray-800 mb-1">
              ₹{property.rent}
            </p>
            <p className="text-sm text-gray-500 mb-1">{property.propertyType || "Room"}</p>

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
              <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-600">No recent listings found.</p>
  )}

  {/* See All Button */}
  <div className="mt-12">
    <a
      href="/all-properties"
      className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
    >
      See All New Rental Properties
    </a>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-[#3A2C99] text-white py-6 text-center">
        <p>© 2025 HostelFinder. All rights reserved.</p>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialState={authState}
      />
    </div>
  );
};

export default Home;
