import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import RenterInfo from "./RenterInfo";
import { useLanguage } from "../context/LanguageContext";
import TranslatedText from "./TranslatedText";
import LanguageToggle from "./LanguageToggle";
import { Menu, X } from "lucide-react";

const OwnerNavbar = ({ setActiveTab, activeTab, setShowListingForm, setSelectedPropertyType }) => {
  const { userData, logout } = useContext(AppContext);
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  if (!userData) {
    return (
      <div className="p-6 text-center text-red-600">
        <RenterInfo text="Please login to view profile." />
      </div>
    );
  }

  return (
    <>
      {/* ✅ Top Navigation */}
      <nav className="bg-white shadow px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold">
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <span className="text-gray-800">Hostel</span>
          <span className="text-[#3A2C99] italic">Finder</span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />
          <button
            onClick={() => {
              setShowListingForm(true);
              setSelectedPropertyType(null);
            }}
            className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer"
          >
            <RenterInfo text="List a Property" />
          </button>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-base font-medium">
              <TranslatedText text={userData.name} />
            </span>
            <button
              className="text-red-500 text-sm cursor-pointer"
              onClick={logout}
            >
              (<RenterInfo text="Sign Out" />)
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* ✅ Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow px-4 py-3 space-y-4">
          <LanguageToggle />
          <button
            onClick={() => {
              setShowListingForm(true);
              setSelectedPropertyType(null);
              setMenuOpen(false);
            }}
            className="block w-full text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
          >
            <RenterInfo text="List a Property" />
          </button>

          <div className="flex flex-col items-start gap-2">
            <span className="text-base font-medium">
              <TranslatedText text={userData.name} />
            </span>
            <button
              className="text-red-500 text-sm cursor-pointer"
              onClick={logout}
            >
              (<RenterInfo text="Sign Out" />)
            </button>
          </div>
        </div>
      )}

      {/* ✅ Tab Buttons Row */}
      <div className="bg-gray-100 px-4 sm:px-6 py-2 flex gap-6 border-b overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("listings")}
          className={`whitespace-nowrap text-sm font-medium ${
            activeTab === "listings"
              ? "text-green-700 border-b-2 border-green-700 pb-1"
              : "text-gray-600"
          }`}
        >
          <RenterInfo text="Listings" />
        </button>
        <button
          onClick={() => setActiveTab("inbox")}
          className={`whitespace-nowrap text-sm font-medium ${
            activeTab === "inbox"
              ? "text-green-700 border-b-2 border-green-700 pb-1"
              : "text-gray-600"
          }`}
        >
          <RenterInfo text="Inbox" />
        </button>
        <button
          onClick={() => setActiveTab("forms")}
          className={`whitespace-nowrap text-sm font-medium ${
            activeTab === "forms"
              ? "text-green-700 border-b-2 border-green-700 pb-1"
              : "text-gray-600"
          }`}
        >
          <RenterInfo text="Forms" />
        </button>
      </div>
    </>
  );
};

export default OwnerNavbar;
