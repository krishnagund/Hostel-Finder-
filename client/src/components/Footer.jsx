import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#3A2C99] text-white py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 text-center sm:text-left">
        
        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
          <img
            src={assets.logo1}
            alt="Hostel Finder"
            className="w-28 sm:w-32 transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>

        {/* Popular Searches */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            POPULAR SEARCHES
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/search?category=apartments">Apartments Near Me</Link></li>
            <li><Link to="/search?category=condos">Condos Near Me</Link></li>
            <li><Link to="/search?category=houses">Houses Near Me</Link></li>
            <li><Link to="/search?category=rooms">Rooms Near Me</Link></li>
            <li><Link to="/search">All Rentals Near Me</Link></li>
          </ul>
        </div>

        {/* Rental Info */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            RENTAL INFO
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/helpful-links">Helpful Links</Link></li>
            <li><Link to="/cities">List of Cities</Link></li>
            <li><Link to="/community-stats">Community Info and Stats</Link></li>
          </ul>
        </div>

        {/* Landlords */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            LANDLORDS
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/list-property">List a Property</Link></li>
            <li><Link to="/my-listings">My Listings</Link></li>
            <li><Link to="/pricing">Prices</Link></li>
            <li><Link to="/property-management">Property Management Companies</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            SOCIAL MEDIA
          </h3>
          <div className="flex justify-center sm:justify-start gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#3b5998] p-2 rounded-full shadow hover:scale-110 transition"
            >
              <FaFacebookF className="text-lg sm:text-xl" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#1DA1F2] p-2 rounded-full shadow hover:scale-110 transition"
            >
              <FaTwitter className="text-lg sm:text-xl" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#E1306C] p-2 rounded-full shadow hover:scale-110 transition"
            >
              <FaInstagram className="text-lg sm:text-xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs sm:text-sm mt-10 border-t border-white/20 pt-4">
        © {new Date().getFullYear()} Hostel Finder. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
