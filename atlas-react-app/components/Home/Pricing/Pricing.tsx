import React from 'react'
import PriceCard from './PriceCard'

const Pricing = () => {
  return (
 <div id="pricing" className="pt-16 pb-16 bg-gray-100">
  <h1 className="text-center text-2xl text-blue-950 font-bold">
    Choose The Plan That&apos;s Right For You
  </h1>
  <p className="mt-3 text-center font-medium text-gray-700 w-[90%] sm:w-[70%] md:w-[50%] mx-auto">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
    Sunt quos architecto harum magnam est.
  </p>
 <div className='w-[80%] mx-auto mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 
 items-center'>
  <div data-aos="fade-up" 
        data-aos-anchor-placement="top-center">
     <PriceCard time="3 Month" price="39.99" />
    </div>
    <div data-aos="fade-up" 
        data-aos-anchor-placement="top-center"    
          data-aos-delay="100">
     <PriceCard time="2 Month" price="29.99" />
    </div>
    <div data-aos="fade-up" 
        data-aos-anchor-placement="top-center"    
          data-aos-delay="200">
     <PriceCard time="1 Month" price="19.99" />
    </div>
</div>

</div>

  )
}

export default Pricing