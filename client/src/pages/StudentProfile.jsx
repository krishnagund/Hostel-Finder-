import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import RenterInfo from "../components/RenterInfo";
import TranslatedText from "../components/TranslatedText";
import LanguageToggle from "../components/LanguageToggle";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const StudentProfile = () => {
  const { userData, setIsLoggedin, setUserData, backendurl, logout, loading } =
    useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    college: "",
    course: "",
    year: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    guardianName: "",
    guardianPhone: "",
    whatsappNumber: "",
    budget: "",
    roomTypePreference: "",
    about: "",
  });
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target)) {
        setMobileProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!userData) return;

    (async () => {
      try {
        const res = await fetch(`${backendurl}/api/messages/student`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
          const unread = data.messages.filter(msg => !msg.read).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("StudentProfile inbox load error:", err);
      }
    })();
  }, [userData, backendurl]);

  // Initialize editable form from user data
  useEffect(() => {
    if (!userData) return;
    setForm((prev) => ({
      ...prev,
      name: userData.name || "",
      phone: userData.phone || "",
      college: userData.studentProfile?.college || "",
      course: userData.studentProfile?.course || "",
      year: userData.studentProfile?.year || "",
      gender: userData.studentProfile?.gender || "",
      dateOfBirth: userData.studentProfile?.dateOfBirth
        ? new Date(userData.studentProfile.dateOfBirth).toISOString().slice(0, 10)
        : "",
      address: userData.studentProfile?.address || "",
      city: userData.studentProfile?.city || "",
      state: userData.studentProfile?.state || "",
      pincode: userData.studentProfile?.pincode || "",
      guardianName: userData.studentProfile?.guardianName || "",
      guardianPhone: userData.studentProfile?.guardianPhone || "",
      whatsappNumber: userData.studentProfile?.whatsappNumber || "",
      budget: userData.studentProfile?.budget || "",
      roomTypePreference: userData.studentProfile?.roomTypePreference || "",
      about: userData.studentProfile?.about || "",
    }));
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.college.trim() || !form.city.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        studentProfile: {
          college: form.college.trim(),
          course: form.course.trim(),
          year: form.year.trim(),
          gender: form.gender.trim(),
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          guardianName: form.guardianName.trim(),
          guardianPhone: form.guardianPhone.trim(),
          whatsappNumber: form.whatsappNumber.trim(),
          budget: form.budget ? Number(form.budget) : undefined,
          roomTypePreference: form.roomTypePreference.trim(),
          about: form.about.trim(),
        },
      };
      const res = await axios.put(`${backendurl}/api/user/profile`, payload, { withCredentials: true });
      if (res.data?.success) {
        toast.success("Profile saved");
        const refreshed = await axios.get(`${backendurl}/api/user/data`, { withCredentials: true });
        if (refreshed.data?.success) {
          setUserData(refreshed.data.userData);
        }
      } else {
        toast.error(res.data?.message || "Failed to save");
      }
    } catch (err) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Navbar ===== */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 shadow-md bg-white">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold">
          <img
            src={assets.logo1}
            alt="Hostel Finder Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <span className="text-gray-800">
            <RenterInfo text="Hostel" />
          </span>
          <span className="text-[#3A2C99] italic">
            <RenterInfo text="Finder" />
          </span>
        </div>

        {/* Desktop Navbar Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <LanguageToggle />

          {/* Divider */}
          <div className="h-7 border-l border-[#3A2C99] mx-2" />

          {/* Profile Dropdown Toggle */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition z-40"
            >
              <FaUser />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col z-50 border border-gray-200">
                <button
                  onClick={() => {
                    navigate("/favorites");
                    setProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="My Faves" />
                </button>
                <button
                  onClick={() => {
                    navigate("/saved-searches");
                    setProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Saved Searches" />
                </button>
                <button
                  onClick={() => {
                    navigate("/student-profile");
                    setProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left bg-blue-50 transition-colors"
                >
                  <RenterInfo text="Profile" />
                </button>
                <button
                  onClick={() => {
                    navigate("/inbox");
                    setProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left flex justify-between items-center transition-colors"
                >
                  <RenterInfo text="Inbox" />
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left text-red-600 w-full transition-colors"
                  >
                    <RenterInfo text="Sign Out" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navbar Right Section */}
        <div className="md:hidden flex items-center gap-2">
          <div className="relative" ref={mobileProfileRef}>
            <button
              onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition z-40"
            >
              <FaUser size={16} />
            </button>

            {mobileProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md flex flex-col z-50 border border-gray-200">
                {/* Language Toggle in Mobile Dropdown */}
                <div className="px-4 py-2 border-b border-gray-200">
                  <LanguageToggle />
                </div>
                
                <button
                  onClick={() => {
                    navigate("/favorites");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="My Faves" />
                </button>
                <button
                  onClick={() => {
                    navigate("/saved-searches");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Saved Searches" />
                </button>
                <button
                  onClick={() => {
                    navigate("/student-profile");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left bg-blue-50 transition-colors"
                >
                  <RenterInfo text="Profile" />
                </button>
                <button
                  onClick={() => {
                    navigate("/inbox");
                    setMobileProfileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-left flex justify-between items-center transition-colors"
                >
                  <RenterInfo text="Inbox" />
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      logout();
                      setMobileProfileOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-left text-red-600 w-full transition-colors"
                  >
                    <RenterInfo text="Sign Out" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Tab Navigation ===== */}
      <div className="bg-gray-100 px-4 sm:px-6 py-2 flex gap-6 border-b overflow-x-auto scrollbar-hide">
        <button className="whitespace-nowrap text-sm font-medium text-green-700 border-b-2 border-green-700 pb-1">
          <RenterInfo text="Student Profile" />
        </button>
        <button
          onClick={() => navigate("/inbox")}
          className="whitespace-nowrap text-sm font-medium text-gray-600 flex items-center gap-2"
        >
          <RenterInfo text="Messages" />
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ===== Main Content ===== */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                <RenterInfo text="Student Profile" />
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                <RenterInfo text="Manage your personal information and preferences" />
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing((e) => !e)}
              className="mt-4 sm:mt-0 px-4 py-2 rounded-md bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition border border-[#3A2C99]"
            >
              {isEditing ? (
                <RenterInfo text="Cancel" />
              ) : (
                <RenterInfo text="Edit Profile" />
              )}
            </button>
          </div>

          {!isEditing && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#3A2C99]" />
                  <RenterInfo text="Personal Information" />
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Full Name" />
                    </p>
                    <p className="font-medium text-gray-800">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Email Address" />
                    </p>
                    <p className="font-medium text-gray-800">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Phone Number" />
                    </p>
                    <p className="font-medium text-gray-800">+91 {userData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="WhatsApp Number" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.whatsappNumber ? `+91 ${userData.studentProfile.whatsappNumber}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Gender" />
                    </p>
                    <p className="font-medium text-gray-800 capitalize">
                      {userData.studentProfile?.gender || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Date of Birth" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.dateOfBirth 
                        ? new Date(userData.studentProfile.dateOfBirth).toLocaleDateString() 
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information Card */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">🎓</span>
                  <RenterInfo text="Academic Information" />
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="College/University" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.college || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Course/Program" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.course || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Academic Year" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.year || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Housing Preferences Card */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">🏠</span>
                  <RenterInfo text="Housing Preferences" />
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Budget (Monthly)" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.budget 
                        ? `₹${new Intl.NumberFormat('en-IN').format(userData.studentProfile.budget)}` 
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Room Type Preference" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.roomTypePreference || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Preferred City" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.city || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact & Address Card */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">📍</span>
                  <RenterInfo text="Contact & Address" />
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Current Address" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.address || "—"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        <RenterInfo text="City" />
                      </p>
                      <p className="font-medium text-gray-800">
                        {userData.studentProfile?.city || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        <RenterInfo text="State" />
                      </p>
                      <p className="font-medium text-gray-800">
                        {userData.studentProfile?.state || "—"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Pincode" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.pincode || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guardian Information Card */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">👨‍👩‍👧‍👦</span>
                  <RenterInfo text="Guardian Information" />
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Guardian Name" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.guardianName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <RenterInfo text="Guardian Phone" />
                    </p>
                    <p className="font-medium text-gray-800">
                      {userData.studentProfile?.guardianPhone 
                        ? `+91 ${userData.studentProfile.guardianPhone}` 
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* About Me Card */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">ℹ️</span>
                  <RenterInfo text="About Me" />
                </h3>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    <RenterInfo text="Personal Description" />
                  </p>
                  <p className="font-medium text-gray-800 whitespace-pre-wrap">
                    {userData.studentProfile?.about || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <form onSubmit={async (e) => { await handleSubmit(e); setIsEditing(false); }} className="space-y-8">
              {/* Personal Information Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#3A2C99]" />
                  <RenterInfo text="Personal Information" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Full Name" /> *
                    </label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Email Address" />
                    </label>
                    <input 
                      value={userData.email} 
                      disabled 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Phone Number" /> *
                    </label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="WhatsApp Number" />
                    </label>
                    <input 
                      name="whatsappNumber" 
                      value={form.whatsappNumber} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Gender" />
                    </label>
                    <select 
                      name="gender" 
                      value={form.gender} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Date of Birth" />
                    </label>
                    <input 
                      type="date" 
                      name="dateOfBirth" 
                      value={form.dateOfBirth} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">🎓</span>
                  <RenterInfo text="Academic Information" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="College/University" /> *
                    </label>
                    <input 
                      name="college" 
                      value={form.college} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Course/Program" />
                    </label>
                    <input 
                      name="course" 
                      value={form.course} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Academic Year" />
                    </label>
                    <input 
                      name="year" 
                      value={form.year} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>

              {/* Housing Preferences Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">🏠</span>
                  <RenterInfo text="Housing Preferences" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Budget (Monthly)" />
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      name="budget" 
                      value={form.budget} 
                      onChange={handleChange} 
                      placeholder="Enter monthly budget"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Room Type Preference" />
                    </label>
                    <select 
                      name="roomTypePreference" 
                      value={form.roomTypePreference} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent"
                    >
                      <option value="">Select Room Type</option>
                      <option value="Single Unit">Single Unit</option>
                      <option value="Double Sharing">Double Sharing</option>
                      <option value="Triple Sharing">Triple Sharing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Preferred City" /> *
                    </label>
                    <input 
                      name="city" 
                      value={form.city} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">📍</span>
                  <RenterInfo text="Address Information" />
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Current Address" />
                    </label>
                    <input 
                      name="address" 
                      value={form.address} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <RenterInfo text="State" />
                      </label>
                      <input 
                        name="state" 
                        value={form.state} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <RenterInfo text="Pincode" />
                      </label>
                      <input 
                        name="pincode" 
                        value={form.pincode} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Information Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">👨‍👩‍👧‍👦</span>
                  <RenterInfo text="Guardian Information" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Guardian Name" />
                    </label>
                    <input 
                      name="guardianName" 
                      value={form.guardianName} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <RenterInfo text="Guardian Phone" />
                    </label>
                    <input 
                      name="guardianPhone" 
                      value={form.guardianPhone} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-[#3A2C99]">ℹ️</span>
                  <RenterInfo text="About Me" />
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <RenterInfo text="Personal Description" />
                  </label>
                  <textarea 
                    name="about" 
                    value={form.about} 
                    onChange={handleChange} 
                    rows="4" 
                    placeholder="Tell us about yourself, your interests, and what you're looking for in accommodation..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2C99] focus:border-transparent" 
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  <RenterInfo text="Cancel" />
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-6 py-2 bg-[#3A2C99] text-white rounded-md hover:bg-white hover:text-[#3A2C99] transition border border-[#3A2C99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <RenterInfo text="Saving..." />
                  ) : (
                    <RenterInfo text="Save Profile" />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
