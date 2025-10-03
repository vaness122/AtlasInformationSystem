import BoxText from '@/components/Helper/BoxText'
import React from 'react'
import { FaBriefcase, FaChess, FaRocket, FaShoppingCart } from 'react-icons/fa'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { MdOutlineDesignServices } from 'react-icons/md'

const Services = () => {
  return (
    <div  className="pt-16 pb-16">
   <div className="w-[80%] mx-auto">
    <BoxText>Our Services</BoxText>
    {/*heading*/}
    <h1   className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
  Our Services Made for You
      </h1>

   {/* Description */}
<p className="mt-4 w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] text-gray-600">
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
  quasi, quas quibusdam eius eum cumque nostrum quaerat?
</p>

{/* Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 gap-y-12 mt-16 items-start">

  {/* 1st Service */}
  <div data-aos="fade-right" 
       data-aos-anchor-placement="top-center" 
    
   className="flex items-start space-x-5">
    
    {/* Icon */}
    <div className="w-14 h-14 rounded-md flex items-center justify-center bg-pink-500 bg-opacity-20">
      <FaRocket className="w-6 h-6 text-orange-400" />
    </div>

    {/* Text Content */}
    <div>
      <p className="text-lg font-bold text-gray-700">Start Up</p>
      <p className="text-sm text-gray-600">
        afafsfaswww waeeeum cumque 
         wqeqwewqe nostrum quaerat?
      </p>
    </div>

  </div>
  
  {/* 2nd Service */}
  <div  data-aos="fade-right" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="100"
  className="flex items-start space-x-5">
    
    {/* Icon */}
    <div className="w-14 h-14 rounded-md flex items-center justify-center bg-pink-500 bg-opacity-20">
      <FaBriefcase className="w-6 h-6 text-orange-400" />
    </div>

    {/* Text Content */}
    <div>
      <p className="text-lg font-bold text-gray-700">Bussiness</p>
      <p className="text-sm text-gray-600">
        afafsfaswww waeeeum cumque 
         wqeqwewqe nostrum quaerat?
      </p>
    </div>

  </div>
  
  {/* 3rd Service */}
  <div data-aos="fade-left" 
        data-aos-anchor-placement="top-center" 
        data-aos-delay="300" 
        className="flex items-start space-x-5">
    
    {/* Icon */}
    <div className="w-14 h-14 rounded-md flex items-center justify-center bg-pink-500 bg-opacity-20">
      <FaShoppingCart className="w-6 h-6 text-orange-400" />
    </div>

    {/* Text Content */}
    <div>
      <p className="text-lg font-bold text-gray-700">E-commerce</p>
      <p className="text-sm text-gray-600">
        afafsfaswww waeeeum cumque 
         wqeqwewqe nostrum quaerat?
      </p>
    </div>

  </div>
    
  {/* 4rth Service */}
  <div className="flex items-start space-x-5">
    
    {/* Icon */}
    <div 
        data-aos="fade-left" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="400"
    className="w-14 h-14 rounded-md flex items-center justify-center bg-pink-500 bg-opacity-20">
      <MdOutlineDesignServices className="w-6 h-6 text-orange-400" />
    </div>

    {/* Text Content */}
    <div>
      <p className="text-lg font-bold text-gray-700">Disgital Design</p>
      <p className="text-sm text-gray-600">
        afafsfaswww waeeeum cumque 
         wqeqwewqe nostrum quaerat?
      </p>
    </div>

  </div>
     
  {/* 5th Service */}
  <div data-aos="fade-left" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="500" className="flex items-start space-x-5">
    
    {/* Icon */}
    <div className="w-14 h-14 rounded-md flex items-center justify-center bg-pink-500 bg-opacity-20">
      <IoColorPaletteOutline className="w-6 h-6 text-orange-400" />
    </div>

    {/* Text Content */}
    <div>
      <p className="text-lg font-bold text-gray-700">Unlimited color</p>
      <p className="text-sm text-gray-600">
        afafsfaswww waeeeum cumque 
         wqeqwewqe nostrum quaerat?
      </p>
    </div>

  </div>
       
  {/* 6th Service */}
  <div data-aos="fade-right" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="600" className="flex items-start space-x-5">
    
    {/* Icon */}
    <div className="w-14 h-14 rounded-md flex items-center justify-center bg-pink-500 bg-opacity-20">
      <FaChess className="w-6 h-6 text-orange-400" />
    </div>

    {/* Text Content */}
    <div>
      <p className="text-lg font-bold text-gray-700">Strategy Solution</p>
      <p className="text-sm text-gray-600">
        afafsfaswww waeeeum cumque 
        
      </p>
    </div>
  </div>
</div>
         </div>
  </div>

  )
}

export default Services