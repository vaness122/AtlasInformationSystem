import React from 'react'
import { ClientReviewCard } from './ClientReviewCard'

const ClientReview = () => {
  return (
    <div className=' pt-16 pb-16 bg-gray-100'>
        {/*Heading*/}
        <h1 className='text-center text-2xl text-blue-950 font-bold'>What Our Happy Client Says</h1>
        {/*sub heading*/}
        <p className='mt-3 text-center font-medium text-gray-700 w-[90%] mx-auto sm:w-[70%] md:w-[50%]'>
            Lorem ipsum dolor Quas, laudantium assumenda.  
            Quisquam sint repudiandae magnam sit, amet, vel vitae atque quas in odit.
          </p>
                  {/* grid */}
                  {/* grid */}
<div  className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center mt-16 w-[80%] mx-auto">
  <div data-aos="fade-left" 
        data-aos-anchor-placement="zoom-in">
        
    <ClientReviewCard 
      image="/images/u1.jpg" 
      name="Jasica We" 
      rating="4.7"
    />
  </div>

  <div data-aos="fade-left" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="100">
    <ClientReviewCard 
      image="/images/u2.jpg" 
      name="Edwin Doe" 
      rating="4.9"
    />
  </div>

  <div data-aos="fade-left" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="200">
    <ClientReviewCard 
      image="/images/u3.jpg" 
      name="Wakin We" 
      rating="4.8"
    />
  </div>

  <div data-aos="fade-left" 
        data-aos-anchor-placement="top-center" 
         data-aos-delay="300">
    <ClientReviewCard 
      image="/images/u4.jpg" 
      name="Bea Toy" 
      rating="4.5"
    />
  </div>
</div>

        </div>
  )
}

export default ClientReview