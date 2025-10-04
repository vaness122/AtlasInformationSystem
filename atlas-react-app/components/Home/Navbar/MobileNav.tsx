import { navlinks } from '@/constant/constant';
import Link from 'next/link';
import React from 'react';
import { CgClose } from 'react-icons/cg';

// ✅ Define props type
type MobileNavProps = {
  ShowNav: boolean;
  closeNav: () => void;
};

const MobileNav: React.FC<MobileNavProps> = ({ ShowNav, closeNav }) => {
    const navOpen = ShowNav?'translate-x-0':'-translate-x-[-100%]';
  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeNav}
        className={`fixed $(navOpen) inset-0 z-[1002] bg-black ... ${
          ShowNav ? 'opacity-70 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* Side Nav */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] sm:w-[60%] bg-blue-900 text-white z-[1050] 
        transform transition-transform duration-500 flex flex-col justify-center space-y-6 px-6
        ${ShowNav ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close Button */}
        <CgClose
          onClick={closeNav}
          className='absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6 cursor-pointer'
        />

        {/* Nav Links */}
        <div className={`text-white $(navOpen) fixed justify-center flex flex-col h-full transform transition-all duration-500 delay-300 w-80% sm:w-[60%] bg-blue-900 space-y-6 z-[1050]`}>

        {navlinks.map((link) => (
          <Link key={link.id} href={link.url} onClick={closeNav}>
            <p className='text-white  w-fit text-[20px] border-b-[1.5px] pb-1 border-white sm:text-[30px]'>
              {link.label}
            </p>
          </Link>
        ))}
      </div>
      </div>
    </>
  );
};

export default MobileNav;
