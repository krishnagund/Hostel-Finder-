import { useContext } from "react"; 
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedin, loading, userRole } = useContext(AppContext);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  // If not logged in → redirect to login
  if (!isLoggedin) {
    return <Navigate to="/" replace />; // or "/"
  }

  // If logged in but role mismatch → show Not Authorized page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />; 
    // 👆 You can create a Forbidden.jsx page
  }

  return children;
};

export default ProtectedRoute;
