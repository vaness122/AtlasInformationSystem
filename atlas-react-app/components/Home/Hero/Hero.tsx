import Image from 'next/image';
import React from 'react'
import { BsStarHalf } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative w-full h-[110vh] sm:h-screen bg-[url('/images/barangay-bg.jpg')] bg-cover bg-center flex justify-center flex-col">
      <div className="w-[90%] md:w-[80%] mx-auto items-center grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Text content */}
        <div data-aos="fade-up">
          <p className="text-sm sm:text-base md:text-xl font-bold text-blue-950">
            Modernizing Local Government Operations
          </p>

          <h1 className="text-2xl md:text-3xl lg:text-4xl mt-6 mb-6 font-bold text-blue-950 leading-[2.5rem] md:leading-[3.5rem]">
            Transform Your Barangay Management
            <span className="block">
              with <span className="text-green-600">AtlasBarangay</span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
            A comprehensive digital platform built on ASP.NET Core and Entity Framework 
            that streamlines resident management, geographic hierarchy, and administrative 
            operations for Philippine local government units. Manage municipalities, barangays, 
            zones, households, and residents with enterprise-grade security and real-time reporting.
          </p>
                     
          {/* Features */}
          <div className='flex sm:flex-row flex-col sm:items-center sm:space-x-10 mt-6'>
            <div className='flex items-center space-x-4'>
              {/* Security Icon */}
              <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              {/* Feature details */}
              <div className='flex flex-col'>
                <h1 className='text-lg sm:text-xl md:text-2xl text-gray-700 font-bold'>
                  Secure
                </h1>
                <p className='text-gray-700 text-sm sm:text-base'>
                  Role-Based Access Control
                </p>
              </div>
            </div>

            <div className='flex mt-6 sm:mt-0 items-center space-x-4'>
              {/* Efficiency Icon */}
              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              {/* Feature details */}
              <div className='flex flex-col'>
                <h1 className='text-lg sm:text-xl md:text-2xl text-gray-700 font-bold'>
                  Efficient
                </h1>
                <p className='text-gray-700 text-sm sm:text-base'>
                  Real-time Data Management
                </p>
              </div>
            </div>
          </div>

          {/* Key System Features */}
          <div className='mt-6 grid grid-cols-2 gap-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>Resident Profiling</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>Household Management</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>Geographic Hierarchy</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>Automated Reporting</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className='mt-8 flex flex-col sm:flex-row w-fit sm:items-center space-y-4 sm:space-y-0 sm:space-x-4'>
            {/* Demo Button */}
            <a href="#demo" className="relative px-10 py-3 font-medium text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-800 ease">
              <span className="absolute bottom-0 left-0 h-full -ml-2">
                <svg viewBox="0 0 487 487" className="w-auto h-full opacity-100 object-stretch" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z" 
                    fill="#FFF" 
                    fillRule="nonzero" 
                    fillOpacity=".1">
                  </path>
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg viewBox="0 0 487 487" className="object-cover w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z" 
                    fill="#FFF" 
                    fillRule="nonzero" 
                    fillOpacity=".1">
                  </path>
                </svg>
              </span>
              <span className="relative">View Demo</span>
            </a>

            {/* Register Button */}
            <a href="/register" className="relative px-10 py-3 font-medium text-white transition duration-300 bg-green-600 rounded-md hover:bg-green-800 ease">
              <span className="absolute bottom-0 left-0 h-full -ml-2">
                <svg viewBox="0 0 487 487" className="w-auto h-full opacity-100 object-stretch" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z" 
                    fill="#FFF" 
                    fillRule="nonzero" 
                    fillOpacity=".1">
                  </path>
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg viewBox="0 0 487 487" className="object-cover w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z" 
                    fill="#FFF" 
                    fillRule="nonzero" 
                    fillOpacity=".1">
                  </path>
                </svg>
              </span>
              <span className="relative">Register Barangay</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className='mt-8 flex items-center space-x-6 text-sm text-gray-600'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span>ASP.NET Core Powered</span>
            </div>
           
          </div>
        </div>
         
        {/* Image content */}
        <div data-aos="fade-down" data-aos-delay="150" className='mx-auto hidden xl:block'>
          <div className='relative'>
            <Image
              src="/images/atlas.jpg"
              alt='Barangay Management Dashboard' 
              width={600} 
              height={500}
              className='rounded-lg shadow-2xl'
            />
            {/* Floating elements */}
            <div className='absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span className='text-xs font-medium'>Live Data</span>
              </div>
            </div>
            <div className='absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                <span className='text-xs font-medium'>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-white/20"></div>
    </div>
  );
};

export default Hero;