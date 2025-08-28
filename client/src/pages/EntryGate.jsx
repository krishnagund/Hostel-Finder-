import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import Home from "./Home";

export default function EntryGate() {
  const { loading, isLoggedin, userRole } = useContext(AppContext);

  if (loading) {
    // Optional: return a spinner or null to avoid flashing the public home page
    return null;
  }

  if (!isLoggedin) {
    return <Home />;
  }

  // Logged in → route by role
  if (userRole === "student") return <Navigate to="/student" replace />;
  if (userRole === "owner")   return <Navigate to="/owner" replace />;
  if (userRole === "admin")   return <Navigate to="/admin" replace />;

  // Fallback: unknown role → show public home or a 403
  return <Home />;
}
