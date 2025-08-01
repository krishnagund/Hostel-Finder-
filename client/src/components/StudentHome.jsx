import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const StudentHome = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

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
          <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">My Faves</button>
          <button className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">Saved Searches</button>

          <div className="h-7 border-1 border-[#3A2C99] mx-2" />

          <button onClick={() => navigate("/inbox")} className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">Inbox</button>
          <button onClick={() => navigate("/student-profile")} className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">Profile</button>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-32 px-6 sm:px-12"
        style={{ backgroundImage: `url(${assets.hostel})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find Affordable Hostels Near Your College
          </h1>
          <p className="text-lg mb-8">
            Search verified listings and connect directly with hostel owners.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search city or college..."
              className="w-full px-6 py-3 bg-white text-black rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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

      {/* ===== Tagline ===== */}
      <section className="text-center bg-white mt-10">
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
      </section>

      {/* ===== How It Works ===== */}
      <section className="px-6 py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            { title: "Search", desc: "Browse hostels by location and amenities." },
            { title: "Compare", desc: "Check reviews and compare pricing." },
            { title: "Connect", desc: "Chat with owners and confirm bookings." },
            { title: "Move In", desc: "Pack your bags and shift stress-free!" },
          ].map((step, i) => (
            <div key={i} className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#3A2C99] text-white py-6 text-center">
        <p>© 2025 HostelFinder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentHome;
