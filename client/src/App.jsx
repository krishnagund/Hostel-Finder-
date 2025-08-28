import React from "react";
import { Routes,Route } from "react-router-dom";
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';  
import EmailVerify from "./pages/EmailVerify";
import StudentHome from "./components/StudentHome";
import HostelOwnerHome from "./components/HostelOwnerHome";
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import StudentProfile from "./pages/StudentProfile"
import Inbox from "./pages/Inbox"
import AllProperties from "./pages/AllProperties";
import HostelSearchPage from "./pages/HostelSearchPage";
import Footer from "./components/Footer";
import FavoriteProperties from "./pages/FavoriteProperties";
import ProtectedRoute from "./pages/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./admin/AdminDashboard"; 
import AdminStats from "./admin/AdminStats";
import UsersPage from "./admin/UsersPage";
import PropertiesPage from "./admin/PropertiesPage";
import EntryGate from "./pages/EntryGate";


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
         <Route path='/' element={<EntryGate />} />
        <Route path='/' element={<Home/>}/>
        <Route
  path="/student"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentHome />
    </ProtectedRoute>
  }
/>

       <Route
  path="/owner"
  element={
    <ProtectedRoute allowedRoles={["owner"]}>
      <HostelOwnerHome />
    </ProtectedRoute>
  }
/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
         <Route path="/student-profile" element={ <ProtectedRoute allowedRoles={["student"]}><StudentProfile /></ProtectedRoute>} />
      <Route path="/inbox" element={<ProtectedRoute allowedRoles={["student"]}><Inbox /></ProtectedRoute>} />
      <Route path="/all-properties" element={<AllProperties />} />
       <Route path="/hostels" element={<HostelSearchPage />} /> 
       <Route path="/favorites" element={<ProtectedRoute allowedRoles={["student"]}><FavoriteProperties /></ProtectedRoute>} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/stats"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminStats />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <UsersPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/properties"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PropertiesPage />
    </ProtectedRoute>
  }
/>

       


      </Routes>
      <Footer />
    </div>
  );
}

export default App;