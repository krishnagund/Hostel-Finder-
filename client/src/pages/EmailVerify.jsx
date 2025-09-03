import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendurl, isLoggedin, userData, getUserData } =
    useContext(AppContext);

  const navigate = useNavigate();

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map((input) => input.value);
    const otp = otpArray.join("");

    const response = await axios.post(
      backendurl + "/api/auth/verify-account",
      { otp }, // ✅ only OTP
      { withCredentials: true } // ✅ send JWT cookie
    );

    const data = response.data;

    if (data.success) {
      toast.success(data.message);
      getUserData(); // refresh user info
      navigate("/");
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 px-4">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo1}
        alt=""
        className="absolute left-4 sm:left-10 top-4 w-20 sm:w-24 md:w-28 cursor-pointer"
      />

      {/* Form */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg text-sm"
      >
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-3 sm:mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-4 sm:mb-6 text-indigo-300 text-xs sm:text-sm md:text-base">
          Enter the 6-digit code sent to your email.
        </p>

        {/* OTP Input Boxes */}
        <div
          className="flex justify-between gap-2 sm:gap-3 mb-6 sm:mb-8"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#333A5C] text-white text-center text-lg sm:text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        {/* Button */}
        <button className="w-full py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full text-sm sm:text-base md:text-lg hover:opacity-90 transition">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
