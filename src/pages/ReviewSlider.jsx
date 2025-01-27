import React from "react";
import arrowupimg from '../assets/images/arrow-right-Up-fil.svg';
import googleimg from '../assets/images/Google.png';
import instaimg from '../assets/images/instagram.png';
import tripAdimg from '../assets/images/tripad.png';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';


const ReviewSlider = () => {

  return (
    <section className='luxurystay my-5 py-3 ReviewsSection'>
                    <div className='row mx-0 text-center topluxury'>
                        <h5>Customers Reviews</h5>
                        <h4>See What Our Clients Say About Us</h4>
                        <div className='d-flex justify-content-center mt-2'>
                            <div className='starmap'><div className='starbox'><i className="bi bi-star-fill"></i> 5.0</div> <div>Trip Advisor</div></div>
                            <div className='starmap'><div className='starbox'> <i className="bi bi-star-fill"></i> 4.3 </div> <div>Google Business</div> </div>
                        </div>
                    </div>
                    <div className="row mt-5 justigy-content-center">

                        <div className="col-lg-4 mb-4 ">
                            <div className="Reviewsleftbox">
                                <h4>Want to Leave Your Feedback?</h4>
                                <p>We value your opinion! Share your experience with us to help us improve and guide future clients.</p>
                                <p>Your feedback is important to us.</p>
                                <div className='socialbox'>
                                    <div><img src={tripAdimg} alt='socialbox' width={100} /></div><div><img src={arrowupimg} alt='socialbox' /></div>
                                </div>
                                <div className='socialbox'>
                                    <div><img src={googleimg} alt='socialbox' width={80} /></div><div><img src={arrowupimg} alt='socialbox' /></div>
                                </div>
                                <div className='socialbox'>
                                    <div><img src={instaimg} width={80} alt='socialbox' /></div><div><img src={arrowupimg} alt='socialbox' /></div>
                                </div>
                            </div>

                        </div>

                        <div className="col-lg-8 col-md-4 ">

                            <div className='customerReview m-0 '>
                                <Swiper
                                    freeMode={true}

                                    autoplay={{
                                        delay: 2500,
                                        disableOnInteraction: false,
                                    }}

                                    //autoplay={false}
                                    navigation={{
                                        nextEl: ".custom-next",
                                        prevEl: ".custom-prev",
                                    }}
                                    breakpoints={{
                                        1024: { slidesPerView: 3, spaceBetween: 30 },
                                        768: { slidesPerView: 2, spaceBetween: 20 }, // Tablets
                                        400: { slidesPerView: 1, spaceBetween: 10 }, // Small screens
                                    }}
                                    modules={[Autoplay, Navigation, FreeMode]}
                                    className="mySwiper"
                                >
                                    <SwiperSlide>
                                        <div className='reviewbox'>
                                            <h4>Mansi Shah</h4>
                                            <p className='starReview'><i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> </p>
                                            <p className='namereview'>Outstanding experience with Virya Wildlife Tours</p>
                                            <p>We took 1 Buffer zone safari and 2 Core zone safaris.Getting on my ride I got very excited as the guide was very enthusiastic and started by giving us the history of the forest on the way of finding the tiger.We learned that tigers mark their own territory and we went to all the territories of each tiger.We ended up finding 3 tigers - Yuvraj, Bijli and Rudra alon... READ MORE</p>

                                        </div></SwiperSlide>
                                    <SwiperSlide>
                                        <div className='reviewbox'>
                                            <h4>Nikhil S</h4>
                                            <p className='starReview'><i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> </p>
                                            <p className='namereview'> Tadoba Andhari Tiger Reserve Safari</p>
                                            <p>Entire Tadoba booking was managed by Virya Wildlife Tours. Paras, Viral and team had made fantastic arrangements! throughout the trip we were on auto pilot and didnt have to worry for anything.. everything was simply awesome, hotel, food, Safari experience! Would highly recommend to book through them!</p>

                                        </div></SwiperSlide>
                                    <SwiperSlide>
                                        <div className='reviewbox'>
                                            <h4>Jessica Ved</h4>
                                            <p className='starReview'><i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> </p >
                                            <p className='namereview'>Excellent!!!</p>
                                            <p>Everything was very well organised by paras Savla. He is a very good host. Our whole trip went on very smoothly. This was our first safari trip but it was just amazing. The hotel paras had put up us in was very good and the food was very good too.
                                                I would really suggest that all should go for the safari with VIRYA wildlife tours.</p>

                                        </div></SwiperSlide>
                                    <SwiperSlide>
                                        <div className='reviewbox'>
                                            <h4>Mansi Shah</h4>
                                            <p className='starReview'><i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> </p>
                                            <p className='namereview'>Outstanding experience with Virya Wildlife Tours</p>
                                            <p>We took 1 Buffer zone safari and 2 Core zone safaris.Getting on my ride I got very excited as the guide was very enthusiastic and started by giving us the history of the forest on the way of finding the tiger.We learned that tigers mark their own territory and we went to all the territories of each tiger.We ended up finding 3 tigers - Yuvraj, Bijli and Rudra alon... READ MORE</p>

                                        </div></SwiperSlide>
                                    <SwiperSlide>
                                        <div className='reviewbox'>
                                            <h4>Mansi Shah</h4>
                                            <p className='starReview'><i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> </p>
                                            <p className='namereview'>Outstanding experience with Virya Wildlife Tours</p>
                                            <p>We took 1 Buffer zone safari and 2 Core zone safaris.Getting on my ride I got very excited as the guide was very enthusiastic and started by giving us the history of the forest on the way of finding the tiger.We learned that tigers mark their own territory and we went to all the territories of each tiger.We ended up finding 3 tigers - Yuvraj, Bijli and Rudra alon... READ MORE</p>

                                        </div></SwiperSlide>

                                </Swiper>
                                <div className='d-flex mt-3'>
                                    <div className=' swiperbtn'>
                                        <button className="custom-prev"><i className="bi bi-arrow-left-short"></i></button>
                                        <button className="custom-next"><i className="bi bi-arrow-right-short"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>

                </section>
  );
};

export default ReviewSlider;
