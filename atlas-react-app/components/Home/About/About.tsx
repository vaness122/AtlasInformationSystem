import BoxText from '@/components/Helper/BoxText';
import Image from 'next/image';
import React from 'react'

const About = () => {
  return (
    <div className='pt-16 pb-16'>
        <div className='w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
            {/*Image content*/}
                  <div data-aos="zoom-in" data-aos-anchor-placement="top-center">

                  <Image
                  src="/images/1.jpg"
                  alt='about'
                  width={600}
                  height={600}
                  />
                  </div>
                  {/*Text Content*/}
                  <div>
                   <BoxText>About Us</BoxText>
                   <h1 className='text-2xl sm:text-3x1 font-bold text-gray-900 mt-3 leading-[2.5rem] sm:leading-[3rem]'>
                    Everything you need to grow your business
                   </h1>
                   <p className='mt-3 leading-relaxed test-sm sm:text-base text-gray-700'>Lorem ipsum dolor sit amet 
                    consectetur adipisicing elit. Quae quis vitae adipisci fuga, minus, 
                    culpa at repudiandae soluta, nam ut ab distinctio exercitationem 
                    inventore placeat harum dolores ea architecto consectetur!
                    </p>
                    <button className='mt-5 text-[#f68967s] font-bold pb-1 border-b-2 border-[#f68967]'>
                      Learn More &#8594;
                    </button>
                    <div className='mt-8 border-l-2 border-gray-200'>
                    <div className='ml-6'>
                      <p className='text-gray-700 font-medium'>
                         &quot; the many itegration that can be linked really help me see 
                         data from other tools I also use. &quot;
                      </p>
                                   <div className="flex items-center space-x-6 mt-6">
                                   <div className="relative w-10 h-10">
                                    <Image 
                                     src="/images/image1.jpg" 
                                    alt="user" 
                                     fill
                                    className="rounded-full object-cover"
                          />
                          </div>
                      <div>
                        <p className='font-medium'>Jessica doe</p>
                        <p className='text-gray-700 text-sm'>
                          Web Developer @TechDev
                          </p>
                      </div>
                      </div>
                    </div>

                    </div>
                  </div>
            </div>
        </div>
    
  );
};

export default About