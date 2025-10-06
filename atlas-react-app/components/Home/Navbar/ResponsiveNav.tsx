
"use client";
import React, { useState } from 'react';
import Nav from './Nav';
import MobileNav from './MobileNav';
import { usePathname } from 'next/navigation';

const ResponsiveNav = () => {
  const pathname = usePathname();

  const [showNav, setShowNav] = useState(false);

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  // Hide nav completely on /register page
  if (pathname === '/register' || pathname === '/login') {
    return null;
  }

  return (
    <div>
      <Nav openNav={openNavHandler} />
      <MobileNav ShowNav={showNav} closeNav={closeNavHandler} />
    </div>
  );
};

export default ResponsiveNav;
