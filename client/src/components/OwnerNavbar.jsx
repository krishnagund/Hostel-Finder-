import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";


const OwnerNavbar = ({ setActiveTab, activeTab,setShowListingForm, setSelectedPropertyType }) => {
    const { userData, setIsLoggedin, setUserData,backendurl } = useContext(AppContext);
     const navigate = useNavigate();
     if (!userData) {
    return <div className="p-6 text-center text-red-600">Please login to view profile.</div>;
  }
  const logout = async() =>{
        try{
            axios.defaults.withCredentials = true;
            const {data} = await axios.post(backendurl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')
        
        }
        catch(error){
               toast.error(error.message)
        }
    }

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <img src={assets.logo1} alt="Hostel Finder Logo" className="h-18 w-18 object-contain" />
          <span className="text-gray-800">Hostel</span>
          <span className="text-[#3A2C99] italic">Finder</span>
        </div>

        <div className="flex items-center gap-4">
         
          <button onClick={() => {
              setShowListingForm(true);
              setSelectedPropertyType(null); // Reset property type
            }} className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition cursor-pointer">List a Property</button>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-1xl font-medium">{userData.name}</span>
            <button className="text-red-500 text-sm" onClick={logout}>
              (Sign Out)
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Buttons Row */}
      <div className="bg-gray-100 px-6 py-2 flex gap-6 border-b">
        <button
          onClick={() => setActiveTab("listings")}
          className={`text-sm font-medium ${activeTab === "listings" ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-600"}`}
        >
          Listings
        </button>
        <button
          onClick={() => setActiveTab("inbox")}
          className={`text-sm font-medium ${activeTab === "inbox" ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-600"}`}
        >
          Inbox
        </button>
        <button
          onClick={() => setActiveTab("forms")}
          className={`text-sm font-medium ${activeTab === "forms" ? "text-green-700 border-b-2 border-green-700 pb-1" : "text-gray-600"}`}
        >
          Forms
        </button>
      </div>
    </>
  );
};

export default OwnerNavbar;
