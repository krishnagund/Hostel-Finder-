import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";

// 👇 Optional: You can also move this into a separate file and import it
const ResetPasswordForm = ({ backendurl, onBack }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Send OTP</button>
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
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Submit OTP</button>
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
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Reset Password</button>
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

const LoginModal = ({ isOpen, onClose }) => {
  const { backendurl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [state, setState] = useState("Login"); // 'Login' or 'Sign Up'
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

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
          ? { name, email, password, role }
          : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        onClose();
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4">
      <div className="relative bg-slate-900 p-8 rounded-lg shadow-xl w-full max-w-md text-indigo-300">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl hover:text-indigo-300"
        >
          &times;
        </button>

        <img
          onClick={onClose}
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

            <form onSubmit={onSubmitHandler}>
              {state === "Sign Up" && (
                <div className="mb-3 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.person_icon} alt="" />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="bg-transparent outline-none w-full"
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                </div>
              )}

              <div className="mb-3 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="" />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="bg-transparent outline-none w-full"
                  type="email"
                  placeholder="Email id"
                  required
                />
              </div>

              <div className="mb-3 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="" />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="bg-transparent outline-none w-full"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>

              {state === "Sign Up" && (
                <div className="mb-4 px-2 text-sm">
                  <label className="block mb-1">Register as:</label>
                  <div className="flex gap-4 text-white">
                    <label>
                      <input
                        type="radio"
                        value="student"
                        checked={role === "student"}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-1"
                      />
                      Student
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="owner"
                        checked={role === "owner"}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-1"
                      />
                      Hostel Owner
                    </label>
                  </div>
                </div>
              )}

              <p
                className="mb-4 text-indigo-400 cursor-pointer text-sm underline"
                onClick={() => setShowResetPassword(true)}
              >
                Forgot Password?
              </p>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
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
