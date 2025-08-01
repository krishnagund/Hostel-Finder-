import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const StudentProfile = () => {
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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
         <div className="flex items-center space-x-2 text-3xl font-bold">
                  <img src={assets.logo1} alt="Hostel Finder Logo" className="h-18 w-18 object-contain" />
                  <span className="text-gray-800">Hostel</span>
                  <span className="text-[#3A2C99] italic">Finder</span>
                </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">{userData.name}</span>
          <button
            onClick={logout}
            className="text-red-600 hover:underline text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm px-6 py-3 flex gap-6 border-b">
        <button className="text-[#3A2C99] font-medium border-b-2 border-[#3A2C99] pb-2">
          Rental Application
        </button>
        <button  onClick={() => navigate("/inbox")} className="text-gray-500 hover:text-[#3A2C99]">Inbox</button>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Primary User Card */}
        <div className="col-span-2 bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold mb-4">Primary User</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{userData.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">+91 XXXXXXXX23</p> {/* Static for now */}
            </div>
          </div>
        </div>

        {/* Co-Applicant */}
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold mb-4">Co-Applicant</h3>
          <p className="text-gray-600 text-sm mb-4">
            Co-applicant is listed on your rental application, your communications with landlord and may have an access to your account.
          </p>
          <button className="bg-[#3A2C99] text-white text-sm px-4 py-2 rounded hover:bg-[#2e2480]">
            ➕ Add Co-Applicant
          </button>
        </div>

        {/* About Me Section */}
        <div className="col-span-3 bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold mb-4">About Me</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Date occupancy is requested</p>
              <p className="font-medium">Jun 1, 2024</p>
            </div>
            <div>
              <p className="text-gray-500">Smoking</p>
              <p className="font-medium">No</p>
            </div>
            <div>
              <p className="text-gray-500">Number of Adults</p>
              <p className="font-medium">1</p>
            </div>
            <div>
              <p className="text-gray-500">Pets</p>
              <p className="font-medium">No</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StudentProfile;
