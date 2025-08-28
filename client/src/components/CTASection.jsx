import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginModal from "../pages/LoginModal";
import { assets } from "../assets/assets";
import RenterInfo from "../components/RenterInfo";

const CTASection = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-0 px-6 sm:px-12"
      style={{ backgroundImage: `url(${assets.hostel})` }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">
          <RenterInfo text="Ready to Find Your Perfect Room?" />
        </h2>
        <p className="text-lg md:text-xl mb-10 text-gray-100">
          <RenterInfo text="Join thousands of happy renters and landlords across India" />
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/hostels")}
            className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
          >
            🔍 <RenterInfo text="Start Searching" />
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
          >
            🏠 <RenterInfo text="List Your Property" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialState="Sign Up"
      />
    </section>
  );
};

export default CTASection;
