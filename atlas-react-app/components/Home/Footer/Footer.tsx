import React from 'react';
import { FaDribbble, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="pt-16 pb-16">
      {/* Footer grid columns */}
      <div className="w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 items-start gap-6">
        {/* 1st part - Solution */}
        <div className="space-y-5">
          <h1 className="text-lg font-bold">Solution</h1>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">Enterprise</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">By Workflow</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">By Team</p>
        </div>

        {/* 2nd part - Company */}
        <div className="space-y-5">
          <h1 className="text-lg font-bold">Company</h1>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">About us</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">News & Press</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">Our Customer</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">Leadership</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">Careers</p>
        </div>

        {/* 3rd part - Resources */}
        <div className="space-y-5">
          <h1 className="text-lg font-bold">Resources</h1>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">Blog</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">Webinar & Events</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">Podcast</p>
          <p className="text-gray-800 font-medium cursor-pointer text-sm hover:text-blue-950">E-book & Guides</p>
        </div>

        {/* 4th part - Contact Us */}
        <div className="space-y-5">
          <h1 className="text-lg font-bold">Contact Us</h1>
          <div className="mt-6">
            <p className="text-sm text-gray-600">Our Mobile Number</p>
            <p className="text-base font-bold text-blue-950 mt-1">+0123 423494323</p>
          </div>
          <div className="mt-6">
            <h1 className="text-sm text-gray-600">Our Email</h1>
            <h1 className="text-base font-bold text-blue-950 mt-1">Example@gmail.com</h1>
          </div>
        </div>
      </div>

      {/* Bottom copyright and social icons */}
      <div className="mt-8 w-[80%] mx-auto border-t pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
        <p className="text-center md:text-left">© 2025 Webdev. All rights reserved.</p>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span>Social :</span>
          <span className="text-gray-500 hover:text-gray-800 cursor-pointer">
            <FaFacebook />
          </span>
          <span className="text-gray-500 hover:text-gray-800 cursor-pointer">
            <FaTwitter />
          </span>
          <span className="text-gray-500 hover:text-gray-800 cursor-pointer">
            <FaDribbble />
          </span>
         
        </div>
      </div>
    </div>
  );
};

export default Footer;
