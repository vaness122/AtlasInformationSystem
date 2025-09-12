"use client";
import React, { useEffect } from 'react'
import Hero from './Hero/Hero';
import About from './About/About';
import Feature from './Feature/Feature';
import Services from './Services/Services';
import ClientReview from './ClientReview/ClientReview';
import Team from './Team/Team';
import Pricing from './Pricing/Pricing';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles


const Home = () => {

  useEffect(()=>{
    const initAos = async()=>{
      await import("aos");
      AOS.init({
      duration:1000,
      easing:"ease",
      once:true,
      anchorPlacement:"top-bottom",


      });  
    };
    initAos();

  })
  return (
    <div className='overflow-hidden'>
       <Hero/>
       <About/>
       <Feature/>
       <Services/>
       <ClientReview/>
       <Team/>
       <Pricing/>
      </div>
   
  )
};

export default Home;