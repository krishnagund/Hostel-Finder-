import React from "react";
import { Routes,Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';  
import EmailVerify from "./pages/EmailVerify";
import StudentHome from "./components/StudentHome";
import HostelOwnerHome from "./components/HostelOwnerHome";
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import StudentProfile from "./pages/StudentProfile"
import Inbox from "./pages/Inbox"



const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/student" element={<StudentHome />} />
        <Route path="/owner" element={<HostelOwnerHome />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
         <Route path="/student-profile" element={<StudentProfile />} />
      <Route path="/inbox" element={<Inbox />} />


      </Routes>
    </div>
  );
}

export default App;