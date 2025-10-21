
"use client";
import React, { use, useState } from 'react'
import Nav from './Nav'
import MobileNav from './MobileNav'
import { usePathname } from 'next/navigation';


const ResponsiveNav = () => {
  const pathname = usePathname();

  const [showNav, setShowNav] = useState(false);

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  // Hide nav completely on /register page
  if (pathname === '/register' || pathname === '/login' || pathname === '/dashboard' || pathname === '/dashboard/profile'|| pathname === '/dashboard/zones'  || pathname === '/dashboard/residents' || pathname === '/dashboard/household'|| pathname === '/barangayadmin/dashboard'|| pathname === '/barangayadmin/profile'|| pathname === '/barangayadmin/zones'|| pathname === '/barangayadmin/residents'|| pathname === '/barangayadmin/household'|| pathname === '/municipalityadmin/dashboard'|| pathname === '/municipalityadmin/profile'|| pathname === '/municipalityadmin/barangays'|| pathname === '/municipalityadmin/users'|| pathname === '/superadmin/dashboard'|| pathname === '/superadmin/profile'|| pathname === '/superadmin/metrics'|| pathname === '/superadmin/users')
     {
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
