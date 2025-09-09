import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import LanguageToggle from "../components/LanguageToggle";
import RenterInfo from "../components/RenterInfo";
import { FaUser } from "react-icons/fa";

const SavedSearches = () => {
  const { backendurl, isLoggedin, logout } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    city: "",
    types: [],
    rentMin: 0,
    rentMax: 100000,
    availabilityMonth: "",
    availabilityDay: "",
  });
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendurl}/api/saved-searches`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setItems(data.savedSearches || []);
    } catch (e) {
      console.error('Load saved searches failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    try {
      const res = await fetch(`${backendurl}/api/saved-searches/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) setItems((arr) => arr.filter((x) => x._id !== id));
    } catch (e) {
      console.error('Delete saved search failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 bg-gray-50">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
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

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <div className="h-7 border-l border-[#3A2C99] mx-2" />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition z-40"
            >
              <FaUser />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-md flex flex-col z-50 border border-gray-200">
                <button
                  onClick={() => { navigate("/favorites"); setProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="My Faves" />
                </button>
                <button
                  onClick={() => { navigate("/saved-searches"); setProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors bg-blue-50"
                >
                  Saved Searches
                </button>
                <button
                  onClick={() => { navigate("/student-profile"); setProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Profile" />
                </button>
                <button
                  onClick={() => { navigate("/student-profile?tab=inbox"); setProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Inbox" />
                </button>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="px-4 py-2 hover:bg-gray-100 text-left text-red-600 w-full transition-colors"
                  >
                    <RenterInfo text="Sign Out" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Right Section */}
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
                <div className="px-4 py-2 border-b border-gray-200">
                  <LanguageToggle />
                </div>
                <button
                  onClick={() => { navigate("/favorites"); setMobileProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="My Faves" />
                </button>
                <button
                  onClick={() => { navigate("/saved-searches"); setMobileProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors bg-blue-50"
                >
                  Saved Searches
                </button>
                <button
                  onClick={() => { navigate("/student-profile"); setMobileProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Profile" />
                </button>
                <button
                  onClick={() => { navigate("/student-profile?tab=inbox"); setMobileProfileOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <RenterInfo text="Inbox" />
                </button>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => { logout(); setMobileProfileOpen(false); }}
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

      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">Saved Searches</h1>
            <button
              className="px-3 py-2 rounded-md bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] border border-[#3A2C99]"
              onClick={() => setShowModal(true)}
            >
              + New Search
            </button>
          </div>

        {loading ? (
          <p className="mt-6 text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="mt-6 text-gray-500">No saved searches yet.</p>
        ) : (
          <div className="mt-4 divide-y">
            {items.map((s) => (
              <div key={s._id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.city}</p>
                  <p className="text-sm text-gray-600">₹{s.rentMin} - ₹{s.rentMax}</p>
                  {(s.availabilityMonth || s.availabilityDay) && (
                    <p className="text-sm text-gray-600">Availability: {s.availabilityMonth || 'Any'} {s.availabilityDay || ''}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    onClick={() => navigate(`/hostels?city=${encodeURIComponent(s.city)}`)}
                  >
                    Search
                  </button>
                  <button
                    className="px-3 py-2 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    onClick={() => remove(s._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      {/* Create Saved Search Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Create Saved Search</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">✕</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Types</label>
                <div className="flex flex-wrap gap-2">
                  {["Single Unit","Double Sharing","Triple Sharing","Other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setForm((f) => {
                          const next = new Set(f.types);
                          next.has(t) ? next.delete(t) : next.add(t);
                          return { ...f, types: Array.from(next) };
                        });
                      }}
                      className={`px-3 py-2 rounded-lg border text-sm ${form.types.includes(t) ? 'bg-[#3A2C99] text-white border-[#3A2C99]' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Rent Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" className="border rounded-md px-3 py-2" value={form.rentMin} onChange={(e) => setForm({ ...form, rentMin: Number(e.target.value) })} placeholder="Min" />
                  <input type="number" className="border rounded-md px-3 py-2" value={form.rentMax} onChange={(e) => setForm({ ...form, rentMax: Number(e.target.value) })} placeholder="Max" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <div className="grid grid-cols-2 gap-3">
                  <select className="border rounded-md px-3 py-2" value={form.availabilityMonth} onChange={(e) => setForm({ ...form, availabilityMonth: e.target.value })}>
                    <option value="">Any</option>
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (<option key={m} value={m}>{m}</option>))}
                  </select>
                  <select className="border rounded-md px-3 py-2" value={form.availabilityDay} onChange={(e) => setForm({ ...form, availabilityDay: e.target.value })}>
                    <option value="">Any</option>
                    {Array.from({ length: 31 }, (_, i) => String(i + 1)).map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50" onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  className="px-4 py-2 rounded-md bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] border border-[#3A2C99]"
                  onClick={async () => {
                    if (!form.city.trim()) { alert('City is required'); return; }
                    try {
                      const res = await fetch(`${backendurl}/api/saved-searches`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify(form),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setShowModal(false);
                        // Navigate to search by city only for clean UX
                        navigate(`/hostels?city=${encodeURIComponent(form.city.trim())}`);
                      } else {
                        alert(data.message || 'Failed to save search');
                      }
                    } catch (e) {
                      console.error('Create saved search failed', e);
                      alert('Failed to save search');
                    }
                  }}
                >
                  Save & Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedSearches;


