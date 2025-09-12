import Image from 'next/image'
import React from 'react'
import { GoWorkflow } from 'react-icons/go'
import { LuPen } from 'react-icons/lu'
import { MdAccessAlarm, MdOutlineTouchApp } from 'react-icons/md'

const Feature = () => {
  return ( 
    <section id="features" className="pt-16 pb-16 bg-gray-100">
    <div className='pt-16 pb-16 bg-gray-100'>
     <div>
         <h1 className='text-center text-2xl text-blue-950 font-bold'>
            Key Features Of the Product
            </h1>
        <p className='mt-3 text-center font-medium text text-gray-700 w-[90%] mx-auto sm:w-[70%] md:w-[50%]'>
            Our Product stands out with its high performance 
            Blazing-fast speed and seamless multitasking.
        </p>
   </div>

{/* Main Grid */}
<div className="w-[80%] mx-auto mt-16 grid grid-cols-1 xl:grid-cols-2 gap-10 items-center">
  
  {/* Inner Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    
    {/* 1st Box */}
    <div  className="bg-white p-4 rounded-lg shadow-sm">
      
      {/* Header: Icon + Title */}
      <div className="flex items-center space-x-3">
        
        {/* Icon */}
        <div data-aos="fade-right" data-aos-anchor-placement="top-center" className="w-12 h-12 rounded-3xl flex items-center justify-center bg-pink-500 bg-opacity-20">
          <MdOutlineTouchApp className="w-6 h-6 text-orange-400" />
        </div>

        {/* Heading */}
        <h1 className="text-lg font-bold text-gray-700">App Integration</h1>
      </div>

      {/* Description */}
      <p className="mt-3 text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Sunt quos architecto harum magnam est sequi numquam 
        necessitatibus laudantium maiores similique id deserunt,
        iusto, iure, explicabo ea atque qui laborum tenetur.
      </p>

    </div>
        {/* 2nd Box */}
    <div data-aos="fade-right" data-aos-anchor-placement="top-center" 
         data-aos-delay="100"
         className="bg-white p-4 rounded-lg shadow-sm">
      
      {/* Header: Icon + Title */}
      <div className="flex items-center space-x-3">
        
        {/* Icon */}
        <div className="w-12 h-12 rounded-3xl flex items-center justify-center bg-pink-500 bg-opacity-20">
          <GoWorkflow className="w-6 h-6 text-orange-400" />
        </div>

        {/* Heading */}
        <h1 className="text-lg font-bold text-gray-700">
            WorkFlow Builder</h1>
      </div>

      {/* Description */}
      <p className="mt-3 text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Sunt quos architecto harum magnam est sequi numquam 
        necessitatibus laudantium maiores similique id deserunt,
        iusto, iure, explicabo ea atque qui laborum tenetur.
      </p>

    </div>
        {/* 3rd Box */}
    <div data-aos="fade-right" data-aos-anchor-placement="top-center" 
         data-aos-delay="200" className="bg-white p-4 rounded-lg shadow-sm">
      
      {/* Header: Icon + Title */}
      <div className="flex items-center space-x-3">
        
        {/* Icon */}
        <div className="w-12 h-12 rounded-3xl flex items-center justify-center bg-pink-500 bg-opacity-20">
          <LuPen className="w-6 h-6 text-orange-400" />
        </div>

        {/* Heading */}
        <h1 className="text-lg font-bold text-gray-700">
            Problem Solution
            </h1>
      </div>

      {/* Description */}
      <p className="mt-3 text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Sunt quos architecto harum magnam est sequi numquam 
        necessitatibus laudantium maiores similique id deserunt,
        iusto, iure, explicabo ea atque qui laborum tenetur.
      </p>

    </div>
        {/* 4th Box */}
    <div data-aos="fade-right" data-aos-anchor-placement="top-center" 
         data-aos-delay="300" className="bg-white p-4 rounded-lg shadow-sm">
      
      {/* Header: Icon + Title */}
      <div className="flex items-center space-x-3">
        
        {/* Icon */}
        <div className="w-12 h-12 rounded-3xl flex items-center justify-center bg-pink-500 bg-opacity-20">
          <MdAccessAlarm className="w-6 h-6 text-orange-400" />
        </div>

        {/* Heading */}
        <h1 className="text-lg font-bold text-gray-700">
            Lifetime  Access</h1>
      </div>

      {/* Description */}
      <p className="mt-3 text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Sunt quos architecto harum magnam est sequi numquam 
        necessitatibus laudantium maiores similique id deserunt,
        iusto, iure, explicabo ea atque qui laborum tenetur.
      </p>

    </div>

  </div>

         {/*Image Content*/}
        <div data-aos="fade-left" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="400">
       <Image 
            src="/images/f1.png" 
            alt="feature" 
            width={700} 
           height={700}
         />
        </div>
     


        </div>
    </div>
    </section>
  )
}

export default Feature