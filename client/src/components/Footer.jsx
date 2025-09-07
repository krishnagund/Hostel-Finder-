import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#3A2C99] text-white py-10 px-6 md:px-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-3xl opacity-5"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 text-center sm:text-left">
        
        {/* Logo */}
        <div className="flex flex-col justify-center sm:justify-start items-center sm:items-start">
          <div className="relative">
            <img
              src={assets.logo1}
              alt="Hostel Finder"
              className="w-28 sm:w-32 transition-transform duration-500 ease-in-out hover:scale-105"
            />
            {/* Logo Glow Effect */}
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 scale-150"></div>
          </div>
          <div className="mt-3 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold">
              <span className="text-white">Hostel</span>
              <span className="text-yellow-300 italic">Finder</span>
            </h2>
            <p className="text-sm text-white/80 mt-1">Find Your Perfect Home</p>
          </div>
        </div>

        {/* Popular Searches */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base relative">
            <span className="relative z-10">POPULAR SEARCHES</span>
            <div className="hidden sm:block absolute -bottom-1 left-0 w-8 h-0.5 bg-yellow-300 rounded-full"></div>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/search?category=apartments" className="hover:text-yellow-300 transition-colors">Apartments Near Me</Link></li>
            <li><Link to="/search?category=condos" className="hover:text-yellow-300 transition-colors">Condos Near Me</Link></li>
            <li><Link to="/search?category=houses" className="hover:text-yellow-300 transition-colors">Houses Near Me</Link></li>
            <li><Link to="/search?category=rooms" className="hover:text-yellow-300 transition-colors">Rooms Near Me</Link></li>
            <li><Link to="/search" className="hover:text-yellow-300 transition-colors">All Rentals Near Me</Link></li>
          </ul>
        </div>

        {/* Rental Info */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base relative">
            <span className="relative z-10">RENTAL INFO</span>
            <div className="hidden sm:block absolute -bottom-1 left-0 w-8 h-0.5 bg-yellow-300 rounded-full"></div>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/faq" className="hover:text-yellow-300 transition-colors">FAQ</Link></li>
            <li><Link to="/helpful-links" className="hover:text-yellow-300 transition-colors">Helpful Links</Link></li>
            <li><Link to="/cities" className="hover:text-yellow-300 transition-colors">List of Cities</Link></li>
            <li><Link to="/community-stats" className="hover:text-yellow-300 transition-colors">Community Info and Stats</Link></li>
          </ul>
        </div>

        {/* Landlords */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base relative">
            <span className="relative z-10">LANDLORDS</span>
            <div className="hidden sm:block absolute -bottom-1 left-0 w-8 h-0.5 bg-yellow-300 rounded-full"></div>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/list-property" className="hover:text-yellow-300 transition-colors">List a Property</Link></li>
            <li><Link to="/my-listings" className="hover:text-yellow-300 transition-colors">My Listings</Link></li>
            <li><Link to="/pricing" className="hover:text-yellow-300 transition-colors">Prices</Link></li>
            <li><Link to="/property-management" className="hover:text-yellow-300 transition-colors">Property Management Companies</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base relative">
            <span className="relative z-10">SOCIAL MEDIA</span>
            <div className="hidden sm:block absolute -bottom-1 left-0 w-8 h-0.5 bg-yellow-300 rounded-full"></div>
          </h3>
          <div className="flex justify-center sm:justify-start gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#3b5998] p-2 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            >
              <FaFacebookF className="text-lg sm:text-xl" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#1DA1F2] p-2 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            >
              <FaTwitter className="text-lg sm:text-xl" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#E1306C] p-2 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            >
              <FaInstagram className="text-lg sm:text-xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 text-center text-xs sm:text-sm mt-10 border-t border-white/20 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Hostel Finder. All rights reserved.</p>
          <div className="flex items-center gap-4 text-white/60">
            <span className="text-xs">Made with ❤️ for students</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Live</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
