import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8  w-full ">
      <div className="container mx-auto px-6 text-center">
        {/* Logo or Brand Name */}
        <h2 className="text-2xl font-bold">YourCompany</h2>

        {/* Navigation Links */}
        <div className="mt-4 flex justify-center space-x-6">
          <a href="#" className="hover:text-gray-400">About</a>
          <a href="#" className="hover:text-gray-400">Services</a>
          <a href="#" className="hover:text-gray-400">Blog</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
        </div>

        {/* Social Media Icons */}
        <div className="mt-6 flex justify-center space-x-4">
          <a href="#" className="text-xl hover:text-blue-500">
            <FaFacebook />
          </a>
          <a href="#" className="text-xl hover:text-sky-400">
            <FaTwitter />
          </a>
          <a href="#" className="text-xl hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="#" className="text-xl hover:text-blue-600">
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="mt-6 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
