import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText";

const StudentProfile = () => {
  const { userData, setIsLoggedin, setUserData, backendurl, logout, loading } =
    useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    (async () => {
      try {
        const res = await fetch(`${backendurl}/api/messages/student`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("StudentProfile inbox load error:", err);
      }
    })();
  }, [userData, backendurl]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <RenterInfo text="Loading..." />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6 text-center text-red-600">
        <RenterInfo text="Please login to view profile." />
      </div>
    );
  }

  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold">
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-14 w-14 sm:h-18 sm:w-18 object-contain"
          />
          <span className="text-gray-800">
            <RenterInfo text="Hostel" />
          </span>
          <span className="text-[#3A2C99] italic">
            <RenterInfo text="Finder" />
          </span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base">
          <span className="font-medium text-gray-700 break-words max-w-[150px] sm:max-w-none">
            <TranslatedText text={userData.name} />
          </span>
          <button
            onClick={logout}
            className="text-red-600 hover:underline text-sm cursor-pointer"
          >
            <RenterInfo text="Sign Out" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 sm:gap-6 border-b">
        <button className="text-[#3A2C99] font-medium border-b-2 border-[#3A2C99] pb-2">
          <RenterInfo text="Rental Application" />
        </button>
        <div className="relative">
          <button
            onClick={() => navigate("/inbox")}
            className="text-gray-500 hover:text-[#3A2C99]"
          >
            <RenterInfo text="Inbox" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        {/* Primary User Card */}
        <div className="lg:col-span-2 bg-white shadow rounded p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">
            <RenterInfo text="Primary User" />
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">
                <RenterInfo text="Name" />
              </p>
              <p className="font-medium">
                <TranslatedText text={userData.name} />
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                <RenterInfo text="Email" />
              </p>
              <p className="font-medium">
                <TranslatedText text={userData.email} />
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                <RenterInfo text="Phone" />
              </p>
              <p className="font-medium">
                +91&nbsp;<TranslatedText text={userData.phone} />
              </p>
            </div>
          </div>
        </div>

        {/* Co-Applicant */}
        <div className="bg-white shadow rounded p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">
            <RenterInfo text="Co-Applicant" />
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            <RenterInfo text="Co-applicant is listed on your rental application, your communications with landlord and may have an access to your account." />
          </p>
          <button className="bg-[#3A2C99] text-white text-sm px-4 py-2 rounded hover:bg-[#2e2480] w-full sm:w-auto">
            ➕ <RenterInfo text="Add Co-Applicant" />
          </button>
        </div>

        {/* About Me Section */}
        <div className="lg:col-span-3 bg-white shadow rounded p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">
            <RenterInfo text="About Me" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">
                <RenterInfo text="Date occupancy is requested" />
              </p>
              <p className="font-medium">
                <RenterInfo text="Jun 1, 2024" />
              </p>
            </div>
            <div>
              <p className="text-gray-500">
                <RenterInfo text="Smoking" />
              </p>
              <p className="font-medium">
                <RenterInfo text="No" />
              </p>
            </div>
            <div>
              <p className="text-gray-500">
                <RenterInfo text="Number of Adults" />
              </p>
              <p className="font-medium">
                <RenterInfo text="1" />
              </p>
            </div>
            <div>
              <p className="text-gray-500">
                <RenterInfo text="Pets" />
              </p>
              <p className="font-medium">
                <RenterInfo text="No" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
