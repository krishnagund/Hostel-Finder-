import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { assets } from '../assets/assets';


import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#3A2C99] text-white py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-10">
        {/* Logo */}
        <div className="col-span-1">
          <img src={assets.logo1} alt="Hostel Finder" 
          className="w-32 transition-transform duration-[500ms] ease-in-out hover:scale-105"
          />
        </div>

        {/* Popular Searches */}
        <div>
          <h3 className="font-semibold mb-3">POPULAR SEARCHES</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search?category=apartments">Apartments Near Me</Link></li>
            <li><Link to="/search?category=condos">Condos Near Me</Link></li>
            <li><Link to="/search?category=houses">Houses Near Me</Link></li>
            <li><Link to="/search?category=rooms">Rooms Near Me</Link></li>
            <li><Link to="/search">All Rentals Near Me</Link></li>
          </ul>
        </div>

        {/* Rental Info */}
        <div>
          <h3 className="font-semibold mb-3">RENTAL INFO</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/helpful-links">Helpful Links</Link></li>
            <li><Link to="/cities">List of Cities</Link></li>
            <li><Link to="/community-stats">Community Info and Stats</Link></li>
          </ul>
        </div>

        {/* Landlords */}
        <div>
          <h3 className="font-semibold mb-3">LANDLORDS</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/list-property">List a Property</Link></li>
            <li><Link to="/my-listings">My Listings</Link></li>
            <li><Link to="/pricing">Prices</Link></li>
            <li><Link to="/property-management">Property Management Companies</Link></li>
          </ul>
        </div>

        {/* Social */}
<div>
  <h3 className="font-semibold mb-3">SOCIAL MEDIA</h3>
  <div className="flex gap-4">
    <a href="#" target="_blank" rel="noopener noreferrer" className="bg-white text-[#3b5998] p-2 rounded-full shadow hover:scale-110 transition">
      <FaFacebookF className="text-xl" />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer" className="bg-white text-[#1DA1F2] p-2 rounded-full shadow hover:scale-110 transition">
      <FaTwitter className="text-xl" />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer" className="bg-white text-[#E1306C] p-2 rounded-full shadow hover:scale-110 transition">
      <FaInstagram className="text-xl" />
    </a>
  </div>
</div>

      </div>

      <div className="text-center text-xs mt-10 border-t border-white/20 pt-4">
        © {new Date().getFullYear()} Hostel Finder. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
