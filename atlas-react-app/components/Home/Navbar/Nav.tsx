"use client";
import { navlinks } from '@/constant/constant';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { GrTechnology } from 'react-icons/gr';
import { HiBars3BottomRight } from 'react-icons/hi2';
import { usePathname } from 'next/navigation';

type NavProps = {
  openNav?: () => void;
};

const Nav: React.FC<NavProps> = ({ openNav }) => {
  // Track if client hydration is done
  const [isClient, setIsClient] = useState(false);
  // Track scroll for background
  const [navbg, setNavbg] = useState(false);

  // Get pathname on client only after hydration
  const pathname = usePathname();

  // Mark hydration complete after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Setup scroll listener only after hydration
  useEffect(() => {
    if (!isClient) return;

    const handler = () => {
      if (window.scrollY >= 90) setNavbg(true);
      else setNavbg(false);
    };
    window.addEventListener("scroll", handler);
    handler(); // init scroll state immediately

    return () => window.removeEventListener("scroll", handler);
  }, [isClient]);

  // Before hydration: render nothing to avoid mismatch
  if (!isClient) return null;

  // After hydration, conditionally hide nav on signup/login
  if (['/signup', '/login'].includes(pathname)) return null;

  return (
    <div className={`fixed ${navbg ? 'bg-white shadow-md' : ''} h-[12vh] z-10 w-full transition-all duration-200`}>
      <div className='flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto'>
        
        {/* Logo Section */}
        <div className='flex items-center space-x-2'>
          <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center'>
            <Image 
              src="/images/atlas.jpg" 
              alt="Atlas Logo" 
              width={24} 
              height={24}
              className="text-white rounded-full"
            />
          </div>
          <h1 className='text-xl hidden sm:block md:text-2xl text-blue-800 font-bold'>
            Atlas
          </h1>
        </div>

        {/* Navlinks */}
        <div className='hidden lg:flex items-center space-x-10'>
          {navlinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className='text-black hover:text-rose-500 font-semibold transition-all duration-200'
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Button Section */}
        <div className='flex items-center space-x-4'>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            <span className="relative">Create Account</span>
          </Link>

          {/* Burger Menu */}
          <HiBars3BottomRight
            className='w-8 h-8 lg:hidden cursor-pointer text-black'
            onClick={openNav}
          />
        </div>
      </div>
    </div>
  );
};

export default Nav;