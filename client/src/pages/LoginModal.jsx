import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Note: For better mobile experience, ensure your HTML has:
// <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

// 👇 Optional: You can also move this into a separate file and import it
const ResetPasswordForm = ({ backendurl, onBack }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [phone, setPhone] = useState(""); 


  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendurl + "/api/auth/send-reset-otp", { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendurl + "/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        onBack(); // Return to login
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail}>
          <h2 className="text-xl font-semibold text-white mb-2 text-center">Reset Password</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 rounded bg-[#333A5C] text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded cursor-pointer">Send OTP</button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form onSubmit={onSubmitOtp}>
          <p className="text-indigo-300 text-sm my-2 text-center">Enter OTP sent to your email</p>
          <div className="flex justify-between mb-4" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                maxLength="1"
                className="w-10 h-10 text-center bg-[#333A5C] text-white rounded"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded cursor-pointer">Submit OTP</button>
        </form>
      )}

      {isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full mb-3 px-4 py-2 rounded bg-[#333A5C] text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded cursor-pointer">Reset Password</button>
        </form>
      )}

      <p
        onClick={onBack}
        className="mt-4 text-sm text-indigo-400 underline text-center cursor-pointer"
      >
        ← Back to Login
      </p>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, initialState = "Login" }) => {
  const navigate = useNavigate();
  const { backendurl, setIsLoggedin, getUserData,setUserData, setUserRole  } = useContext(AppContext);
  const [state, setState] = useState(initialState); // Use initialState prop
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
   const [phone, setPhone] = useState(""); // ← this fixes the error

  // Update state when initialState prop changes
  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  // Clear form fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all form fields when modal closes
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("student");
      setShowResetPassword(false);
    }
  }, [isOpen]);

  // Focus management when modal opens
  useEffect(() => {
    if (isOpen) {
      // Focus on the first input when modal opens
      const firstInput = document.querySelector('input[type="text"], input[type="email"]');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    // Clear form fields before closing
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setRole("student");
    setShowResetPassword(false);
    onClose();
  };

const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    axios.defaults.withCredentials = true;

    const url =
      state === "Sign Up"
        ? backendurl + "/api/auth/register"
        : backendurl + "/api/auth/login";

    const payload =
      state === "Sign Up"
        ? { name, email, password, role,phone }
        : { email, password };

    const { data } = await axios.post(url, payload);


   if (data.success) {
  if (state === "Sign Up") {
    // 🔹 Registration case
    toast.success("Registered successfully! Please verify your email.");
    onClose();
    navigate("/email-verify"); // redirect to verify page
  } else {
    // 🔹 Login case
    if (!data.user.isAccountVerified) {
      toast.error("Please verify your email before logging in.");
      return;
    }
    setIsLoggedin(true);
    setUserData(data.user);
    setUserRole(data.user.role);
    onClose();

    if (data.user.role === "student") {
  navigate("/student");
} else if (data.user.role === "owner") {
  navigate("/owner");
} else if (data.user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/");
}

  }
} else {
  toast.error(data.message || "Failed");
}

  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
};



  if (!isOpen) return null;

    return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center backdrop-blur-sm bg-black/70 p-4 pt-16 sm:pt-4"
      onClick={handleClose}
    >
      <div 
        className="relative bg-slate-900 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md text-indigo-300 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-white text-xl hover:text-indigo-300 cursor-pointer z-10"
        >
          &times;
        </button>

        <img
          onClick={handleClose}
          src={assets.logo1}
          alt="logo"
          className="mx-auto mb-6 w-20 cursor-pointer"
        />

        {!showResetPassword ? (
          <>
            <h2 className="text-2xl font-semibold text-white text-center mb-3">
              {state === "Sign Up" ? "Create Account" : "Login"}
            </h2>
            <p className="text-center text-sm mb-4">
              {state === "Sign Up"
                ? "Create Your Account"
                : "Login to Your Account!"}
            </p>

            <form onSubmit={onSubmitHandler} className="space-y-3">
              {state === "Sign Up" && (
                <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.person_icon} alt="" className="flex-shrink-0" />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="bg-transparent outline-none w-full text-sm sm:text-base"
                    type="text"
                    placeholder="Full Name"
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              {state === "Sign Up" && (
  <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
    <img src={assets.mail_icon} alt="" className="flex-shrink-0" />
    <input
      onChange={(e) => setPhone(e.target.value)}
      value={phone}
      className="bg-transparent outline-none w-full text-sm sm:text-base"
      type="tel"
      placeholder="Phone Number"
      required
      autoComplete="tel"
    />
  </div>
)}


              <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="" className="flex-shrink-0" />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="bg-transparent outline-none w-full text-sm sm:text-base"
                  type="email"
                  placeholder="Email id"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="" className="flex-shrink-0" />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="bg-transparent outline-none w-full text-sm sm:text-base"
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {state === "Sign Up" && (
                <div className="px-2 text-sm">
                  <label className="block mb-1">Register as:</label>
                  <div className="flex gap-4 text-white">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="student"
                        checked={role === "student"}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-2"
                      />
                      Student
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="owner"
                        checked={role === "owner"}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-2"
                      />
                      Hostel Owner
                    </label>
                  </div>
                </div>
              )}

              <p
                className="text-indigo-400 cursor-pointer text-sm underline text-center"
                onClick={() => setShowResetPassword(true)}
              >
                Forgot Password?
              </p>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer hover:from-indigo-600 hover:to-indigo-800 transition-all"
              >
                {state}
              </button>
            </form>

            <p className="text-center text-xs mt-4 text-gray-400">
              {state === "Sign Up"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <span
                onClick={() =>
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
                className="text-blue-400 cursor-pointer underline"
              >
                {state === "Sign Up" ? "Login here" : "Sign up"}
              </span>
            </p>
          </>
        ) : (
          <ResetPasswordForm
            backendurl={backendurl}
            onBack={() => setShowResetPassword(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
