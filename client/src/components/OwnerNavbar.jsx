import { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import RenterInfo from "./RenterInfo";
import { useLanguage } from "../context/LanguageContext";
import TranslatedText from "./TranslatedText";
import LanguageToggle from "./LanguageToggle";
import { Menu, X } from "lucide-react";

const OwnerNavbar = ({ setActiveTab, activeTab, setShowListingForm, setSelectedPropertyType }) => {
  const { userData, logout, backendurl } = useContext(AppContext);
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userData) return;
    
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`${backendurl}/api/messages/unread-count`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.unreadCount);
        }
      } catch (err) {
        console.error("Error fetching unread count", err);
      }
    };

    fetchUnreadCount();
  }, [userData, backendurl]);

  if (!userData) {
    return (
      <div className="p-6 text-center text-red-600">
        <RenterInfo text="Please login to view profile." />
      </div>
    );
  }

  return (
    <>
      {/* Top Navigation - Integrated with page */}
      <nav className="flex justify-between items-center px-6 sm:px-8 py-4 bg-gray-50 relative">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold cursor-pointer">
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <span className="text-gray-800">Hostel</span>
          <span className="text-[#3A2C99] italic">Finder</span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <div className="h-6 border-l border-[#3A2C99] mx-2"></div>
          <button
            onClick={() => {
              setShowListingForm(true);
              setSelectedPropertyType(null);
            }}
            className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
          >
            <RenterInfo text="+ List Property" />
          </button>
          <div className="flex items-center gap-2">
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-[#3A2C99] transition-all duration-300 ease-in-out hover:scale-110"
          >
            {menuOpen ? <X size={24} className="rotate-180 transition-transform duration-300" /> : <Menu size={24} className="transition-transform duration-300" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full right-0 bg-white shadow-md flex flex-col gap-3 px-6 py-4 w-48 z-20 md:hidden animate-in slide-in-from-top-2 duration-300">
            <LanguageToggle />
            <button
              onClick={() => {
                setShowListingForm(true);
                setSelectedPropertyType(null);
                setMenuOpen(false);
              }}
              className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              <RenterInfo text="+ List Property" />
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
      </nav>

      {/* Tab Navigation - Integrated with page */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 flex gap-6 overflow-x-auto scrollbar-hide border-b border-gray-200">
        <button
          onClick={() => setActiveTab("listings")}
          className={`whitespace-nowrap text-sm font-medium ${
            activeTab === "listings"
              ? "text-green-700 border-b-2 border-green-700 pb-1"
              : "text-gray-600"
          }`}
        >
          <RenterInfo text="My Listings" />
        </button>
        <button
          onClick={() => setActiveTab("inbox")}
          className={`whitespace-nowrap text-sm font-medium flex items-center gap-2 ${
            activeTab === "inbox"
              ? "text-green-700 border-b-2 border-green-700 pb-1"
              : "text-gray-600"
          }`}
        >
          <RenterInfo text="Messages" />
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
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
