import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);  // NEW


  const checkAuth = async () => {
  try {
    const response = await axios.get(backendurl + "/api/auth/is-auth", {
      withCredentials: true
    });
    const data = response.data;

    if (data.success) {
      setIsLoggedin(true);
      await getUserData();
    } else {
      setIsLoggedin(false);  
      setUserData(null);
      setUserRole(null);
    }
  } catch (error) {
    setIsLoggedin(false);     
    setUserData(null);
    setUserRole(null);
    console.error("Authentication check failed:", error.message);
  } finally {
    setLoading(false);   
  }
};



  const getUserData = async () => {
  try {
    const response = await axios.get(backendurl + "/api/user/data", {
      withCredentials: true
    });
    const data = response.data;

    if (data.success) {
      setUserData(data.userData);
      setUserRole(data.userData.role);  
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Failed to fetch user data");
  }
};

const logout = async () => {
  try {
    await axios.post(backendurl + "/api/auth/logout", {}, { withCredentials: true });
  } catch (err) {
    console.error("Logout failed:", err.message);
  }
  setIsLoggedin(false);
  setUserData(null);
  setUserRole(null);
};



  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    userRole,          
    setUserRole, 
    getUserData,
    logout,
    loading

  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;