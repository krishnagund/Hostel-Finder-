import React, { use } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {


    const navigate = useNavigate();
    const {userData,backendurl,setUserData,setIsLoggedin} = useContext(AppContext);

    const sendVerificationOtp = async () => {
  try {
    axios.defaults.withCredentials = true;
    const response = await axios.post(backendurl + '/api/auth/send-verify-otp');
    const data = response.data;

    if (data.success) {
      navigate('/email-verify');
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

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
           <div className="bg-gray-50 min-h-screen font-sans">
              {/* Navbar */}
             <nav className="flex justify-between items-center h-25 px-8 shadow-md bg-[#3A2C99] text-white">
                <div className="flex items-center space-x-2 text-white text-3xl font-bold">
          <img src={assets.logo1} alt="Hostel Finder Logo" className="h-22 w-22 object-contain" />
          <span>HostelFinder</span>
        </div>
                <div className="flex items-center gap-4">
          <button  onClick={() => navigate('/login')} className="text-white border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition cursor-pointer">
            Register
          </button>
          <button  onClick={() => navigate('/login')} className="text-white border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition cursor-pointer">
            Login
          </button>
        </div>
              </nav>
              </div>
    );
}

export default Navbar;