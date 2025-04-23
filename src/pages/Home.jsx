import React, { useEffect, useRef, useState } from "react";
import banner from '../assets/images/banner.jpg'
import rightbanner from '../assets/images/bannright.png'
import { Link } from 'react-router-dom';
import arrowlink from '../assets/images/arrow-right-down-fill.svg';
import aboutimg from '../assets/images/about.png';
import sucssimg from '../assets/images/Success.svg';
import houseimg from '../assets/images/House.svg';
import safarimg from '../assets/images/Safari.svg';
import bestchoiceimg from '../assets/images/Bestchoice.svg';
import Houseicon from '../assets/images/Houseicon.svg';
import facilityimg1 from '../assets/images/facilityimg1.png';
import facilityimg2 from '../assets/images/facilityimg2.png';
import facilityimg3 from '../assets/images/facilityimg3.png';
import ContactSection from './ContactSection';
import ReviewSlider from "./ReviewSlider";
import LoginModal from "./LoginModal";
import MainFooter from "./MainFooter";
import { useLocation } from "react-router-dom";
import API from "../api";
import { BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const sectionRef = useRef(null);
    const [loginModalshow, setLoginModalshow] = useState(false);
    const [isModelOpen, setIsmodelOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", description: "" });
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const handleModelOpen = (title, description) => {
        setModalContent({ title, description });
        setIsmodelOpen(true);
    }

    const handleCloseModal = () => {
        setIsmodelOpen(false);
    };

    // Scroll function
    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

    };

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace("#", "");
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await API.get("rooms/room");
                const data = response.data;
                setRooms(data);
            } catch (e) {
                console.error("Error in fetching room data", e)
            }
        }
        fetchRooms();
    }, [])

    return (
        <div className="padding-x">
            <div className='container-fluid'>
                <div className='banner-top'>
                    <div className='imgbanner position-relative'>
                        <img src={banner} alt='banner' />
                        <svg xmlns="http://www.w3.org/2000/svg" className='banner-overlay' width="1856" height="840" viewBox="0 0 1856 840" fill="none">
                            <path d="M1824 0H32C14.3269 0 0 14.3269 0 32V808C0 825.673 14.3269 840 32 840H1124C1156 840 1161.33 816 1160 804V479.5C1160 458.3 1178 452.667 1187 452.5H1827C1848.6 452.5 1855.33 433.167 1856 423.5V32C1856 14.3269 1841.67 0 1824 0Z" fill="url(#paint0_linear_2_63)" />
                            <defs>
                                <linearGradient id="paint0_linear_2_63" x1="928" y1="0" x2="928" y2="900" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="" stopOpacity="0" />
                                    <stop offset="0.248723" stopOpacity="0" />
                                    <stop offset="1" stopColor="#1E1E1E" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className='banner-contain position-absolute'>

                            <h3>Experience nature at its best with modern amenities and aesthetics</h3>
                            <p>VRRUKSH ECO STAY - VIRYA WILDLIFE TOURS RESORT is situated at the boundary of the core area of the forest, making it an felicitious stay for your next safari destination.</p>


                        </div>
                        <div className='right-banner'>
                            <div className='position-relative'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="672" height="363" viewBox="0 0 672 363" fill="none">
                                    <path d="M32 363.004H640C657.673 363.004 672 348.677 672 331.004V78.0042C672 59.2728 664.5 51.0042 648 51.0042H618H604.5C595.5 50.8375 577.5 45.4042 577.5 25.0042C577.5 4.60417 560.833 -0.162494 552.5 0.00417277H32C14.3269 0.00417277 0 14.3311 0 32.0042V331.004C0 348.677 14.3269 363.004 32 363.004Z" fill="#F1F1E7" />
                                </svg>
                                <div className='right-contain position-absolute'>

                                    <p>Estimate your stay cost just by<br />
                                        <b> selecting your booking preferences</b></p>
                                    <img src={rightbanner} alt='rightbanner' />
                                    <Link onClick={() => scrollToSection(sectionRef)} className='booklink'>Book your stay</Link>
                                </div>
                                <div className='arrowbtn'>
                                    <img src={arrowlink} alt='arrowlink' />
                                </div>
                            </div>
                        </div>


                    </div>

                </div>

                <div className='row my-5 py-3 g-md-5 mx-0' id="about">
                    <div className='col-lg-4'>
                        <div className='aboutleftcontain'>
                            <h4>Welcome to
                                Vrruksh Eco Stay</h4>
                            <img src={aboutimg} alt='abouimg' />
                        </div>
                    </div>
                    <div className='col-lg-8'>
                        <div className='aboutrightcontain'>
                            <p>VRRUKSH ECO STAY - VIRYA WILDLIFE TOURS RESORT offers a peaceful sojourn in the lap of nature while enveloping you with contemporary conveniences.</p>
                            <p>Our Luxury resort in Moharli Taboba comprises of 9 Mud Block Cottages and 6 Luxurious Tents and a outdoor swimming pool of 800 sqft with a baby pool enclosed by the Deck area around the pool. The enthralling ambience of the resort across 2.5 acres of land is surrounded by lush green trees like Mango, Jamun, lemon, Krishna Sura, Radha Sura, Bettle Nut, Green Bamboo and Mahogany trees.</p>
                        </div>
                    </div>
                </div>



                <section className='whychoosus' id="whychoos">

                    <div className='row mx-0'>
                        <h5>Why Choose Us?</h5>
                        <div className='d-flex align-items-center'>
                            <h4>Your Trusted Partner for a Peaceful Stay During Your Adventure</h4>
                            <div className='arrowbtn position-inherit ms-3'>
                                <img src={arrowlink} alt='arrowlink' />
                            </div>
                        </div>
                    </div>
                    <div className='row mx-0'>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                            <div className='whychoosusbox'>
                                <img src={sucssimg} alt='aboutimg' />
                                <h6>Expertise and Experience</h6>
                                <p>Our Guidance is With Experience. With 1000+ tours and 5000+ safari bookings pan India, we help you with complete package at Vrruksh eco-stay. </p>
                            </div>

                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                            <div className='whychoosusbox'>
                                <img src={houseimg} alt='aboutimg' />
                                <h6>Quality <br />Craftsmanship</h6>
                                <p>This resort is created and built under the guidance of one the founder firm that specializes in stabilized soil blocks which has been advocating for the use of mud in construction for decades.</p>
                            </div>

                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                            <div className='whychoosusbox'>
                                <img src={safarimg} alt='aboutimg' />
                                <h6>Surrounded by
                                    Adventure Safaris</h6>
                                <p>5 safari gates do fall under 5-10 kilometres Vicinity of our resort, making it the most convenient jungle safari trip.</p>
                            </div>

                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                            <div className='whychoosusbox'>
                                <img src={bestchoiceimg} alt='aboutimg' />
                                <h6>Customer-Centric Approach</h6>
                                <p>We offer many additional services awaiting your attention which can be opted as per the choice at the resort to make your holiday memorable.</p>
                            </div>

                        </div>
                    </div>


                </section>

                <section className='luxurystay my-5 py-3 ' id="rooms">
                    <div className='row mx-0 text-center topluxury'>
                        <h5>Abode at VRRUKSH ECO STAY</h5>
                        <h4>Luxury Stays- Comfort Clubbed with Wilderness</h4>
                        <p>Earthy lodges, untainted excursions, awe-inspiring encounters with the wilderness – Vrruksh Eco Stay serve as the epitome of peaceful sojourn in the lap of nature while enveloping you with contemporary conveniences.</p>
                    </div>
                    <div className="row">

                        {
                            rooms.slice(0, 3).map((room) => (
                                <div className="col-lg-4 mt-4 mb-lg-0">
                                    <div className="luximgbox position-relative rounded-img">
                                        {
                                            JSON.parse(room.room_images).slice(0, 1).map((image) => (
                                                <img src={`${BASE_URL}/assets/images/${image}`} alt="luximg" width={"100%"} />
                                            ))
                                        }
                                        <svg xmlns="http://www.w3.org/2000/svg" width="596" height="674" className='luximgoverlay' viewBox="0 0 596 674" fill="none">
                                            <path d="M564 0H32C14.3269 0 0 14.3269 0 32V642C0 659.673 14.3269 674 32 674H434.5C453.7 674 457.5 659 457 651.5V607.5C457 593.5 469.333 589.333 475.5 589H575.5C592.3 589 596.167 575.333 596 568.5V551V32C596 14.3269 581.673 0 564 0Z" fill="url(#paint0_linear_2_179)" />
                                            <defs>
                                                <linearGradient id="paint0_linear_2_179" x1="298.003" y1="0" x2="298.003" y2="722.143" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="white" stopOpacity="0" />
                                                    <stop offset="0.435" stopOpacity="0" />
                                                    <stop offset="1" stopColor="#1E1E1E" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="luxboxcontent ">
                                            <h3 >{room.room_name}</h3>
                                            <p className="amenities">
                                                {room.amenities.map((amenity, idx) => (
                                                    <span className="amenities" key={idx}>
                                                        <div className="amenities-tags">
                                                            {amenity}
                                                        </div>
                                                        <br />
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                        <div
                                            // onClick={() => handleModelOpen(
                                            //     room.room_name,
                                            //     room.description
                                            // )}
                                            onClick={() => navigate("/book-your-stay")}
                                            className='arrowbtn luxarrybtn'>
                                            <img src={arrowlink} alt='arrowlink' />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </section>


                {/* Modal */}
                {isModelOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-btn" onClick={handleCloseModal}>
                                &times;
                            </button>
                            <h3>{modalContent.title}</h3>
                            <p>{modalContent.description}</p>
                        </div>
                    </div>
                )}


                <section className='luxurystay my-5 py-3  bookComfort' id="rooms" ref={sectionRef}>
                    <div className='row mx-0 text-center topluxury'>

                        <h4>Book an Immersive Comfort in the Lap of Nature</h4>
                        <p>Create unforgettable moments as you immerse yourself in the cultural and natural Vrruksh Eco Stay, one the few Wilderness Eco-Stay Resorts in India.</p>
                    </div>
                    <div className="row mt-4 ">

                        {
                            rooms.slice(0, 3).map((room) => (
                                <div className="col-lg-4  mt-4 ">
                                    <div className="bookcomfortbox">
                                        <div className='topbook'>{room.type}</div>
                                        <h4>{room.room_name}</h4>
                                        {
                                            JSON.parse(room.room_images).slice(0, 1).map((image) => (
                                                <img src={`${BASE_URL}/assets/images/${image}`} alt='bokok' />
                                            ))
                                        }
                                        <p>{room.description}</p>
                                        <h6>What’s in There for You?</h6>
                                        <ul>
                                            {
                                                room.amenities.map((amenity) => (
                                                    <li>{amenity}</li>
                                                ))
                                            }
                                            <li><span>..and nature</span></li>
                                        </ul>
                                        <div className='bookcombtn' onClick={() => navigate("/book-your-stay")}><img src={Houseicon} alt='' width={20} className='me-2' />Book your stay</div>
                                    </div>
                                </div>
                            ))
                        }


                        {/* <div className="col-lg-4  mt-4 ">
                            <div className="bookcomfortbox popbg">
                                <div className='topbook'>Most Popular</div>
                                <h4>Median Tents</h4>
                                <img src={bookimg2} alt='bokok' />
                                <p>Indulge in an unforgettable outdoor glamping experience with a weather and storm proof lodging structure. Awaiting here is the lavish and unique stay option for your holiday.</p>
                                <h6>What’s in There for You?</h6>
                                <ul>
                                    <li>4 Medium Size Clamping Tents</li>
                                    <li>650 sqft each</li>
                                    <li>King size bed</li>
                                    <li>Sofa cum bed</li>
                                    <li>Personal pool</li>
                                    <li>Sit out area in the deck</li>
                                    <li><span>..and nature</span></li>
                                </ul>
                                <div className='bookcombtn' onClick={() => setLoginModalshow(true)}><img alt='' src={Houseicon} width={20} className='me-2' />Book your stay</div>
                            </div>
                        </div>

                        <div className="col-lg-4  mt-4 ">
                            <div className="bookcomfortbox">
                                <div className='topbook'>Premium</div>
                                <h4>Colossal Tents</h4>
                                <img src={bookimg3} alt='bokok' />
                                <p>Dive in to experience the combination of pure luxury and being outside in tranquility with nature. The perfect gateway for your next grandeur trip.</p>
                                <h6>What’s in There for You?</h6>
                                <ul>
                                    <li>2 Large Lavish Clamping Tents</li>
                                    <li>850 sqft each</li>
                                    <li>King size bed</li>
                                    <li>6 ft Bay Window</li>
                                    <li>Verandah with sit out area</li>
                                    <li><span>..and nature</span></li>
                                </ul>
                                <div className='bookcombtn' onClick={() => setLoginModalshow(true)}><img alt='' src={Houseicon} width={20} className='me-2' />Book your stay</div>
                            </div>
                        </div> */}

                    </div>

                </section>


                <section className='luxurystay my-5 py-3 Facilities' id="facilities">
                    <div className='row mx-0 text-center topluxury'>
                        <h5>Facilities Offered with Gratification and Cheer</h5>
                        <h4>Tailored Specifically for your Stay Needs</h4>
                        <p>We adhere to an avant-garde theme, offering guests the perfect blend of rustic and modern lifestyle.</p>
                    </div>
                    <div className="row mt-3">

                        <div className="col-lg-4 mt-4 mb-lg-0">
                            <div className="luximgbox position-relative">
                                <img src={facilityimg3} alt="facilityimg3" width={"100%"} />

                                <div
                                    onClick={() => navigate("/book-your-stay")}
                                    className='arrowbtn luxarrybtn'>
                                    <img src={arrowlink} alt='arrowlink' />
                                </div>
                            </div>
                            <div className='facilitybobBottom'>
                                <h4>A Unique and Sustainable Presence</h4>
                                <p>Vrruksh Eco Stay is amongst the few Wilderness Eco-Stay Resorts in India. Our resort is made of Stabilized Mud Blocks thus eliminating use of additional energy needs like diesel, electricity. Also, We fulfill our own energy needs by solar panel installed at the resort.</p>
                            </div>
                        </div>

                        <div className="col-lg-4 mt-4 mb-lg-0">
                            <div className="luximgbox position-relative">
                                <img src={facilityimg2} alt="facilityimg3" width={"100%"} />

                                <div
                                    onClick={() => navigate("/book-your-stay")}
                                    className='arrowbtn luxarrybtn'>
                                    <img src={arrowlink} alt='arrowlink' />
                                </div>
                            </div>
                            <div className='facilitybobBottom'>
                                <h4>Thrilling Wildlife Safaris Zones</h4>
                                <p>Situated at the boundary of the core area of the forest, approximately 8 mins away from the Moharli safari Gate, approximately 10 mins away from the Junona safari Gate and approximately 16 mins from Dewada, Adegaon and Agarzari safari gate at Tadoba Andhari Tiger Reserve, making it an felicitious stay for your next safari destination.</p>
                            </div>
                        </div>

                        <div className="col-lg-4 mt-4 mb-lg-0">
                            <div className="luximgbox position-relative">
                                <img src={facilityimg1} alt="facilityimg3" width={"100%"} />

                                <div
                                    onClick={() => navigate("/book-your-stay")}
                                    className='arrowbtn luxarrybtn'>
                                    <img src={arrowlink} alt='arrowlink' />
                                </div>
                            </div>
                            <div className='facilitybobBottom'>
                                <h4>Grand and Luxurious Accommodation</h4>
                                <p>Welcoming you into the luxury of the 2000 sqft courtyard and experience a lip smacking culinary journey at our 800 sq ft dinning area. To add to your experience, we have Bon Fire at different places close to cottages and tent area. </p>
                            </div>
                        </div>

                    </div>

                </section>


                <section className='luxurystay my-5 py-3 WonderingSection' id="reach">
                    <div className='row mx-0 text-center topluxury'>
                        <h5>Wondering, How to Reach Vrruksh Eco Stay?</h5>
                        <h4>Curating Meaningful Journeys at Tadoba</h4>
                        <p>Reconnect with Nature by Directly Reaching Vrruksh Eco Stay</p>
                    </div>
                    <div className="row mt-5 justigy-content-center">

                        <div className="col-lg-8 mb-4">
                            <div className="luximgbox">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.3748229058547!2d79.3254764!3d20.201739699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd333f34a4f44b3%3A0xe633a784e225eddc!2sVrruksh%20Eco-Stay!5e0!3m2!1sen!2sin!4v1741007385207!5m2!1sen!2sin" width="1000" height="580" className="map-style" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4 ">

                            <div className='facilitybobBottom m-0 py-5'>
                                <h4>Visitors Information:</h4>
                                <p>The nearest International Airport is Dr. Babasaheb Ambedkar International Airport, Nagpur (140 kilometres (87 mi) via Umrer, Bhisi, and Chimur). The stay is accessible by rail via Chandrapur railway station which is 45 kilometres (28 mi) away. The nearest main bus stands are Chandrapur 45 kilometres (28 mi) away and Chimur 32 kilometres (20 mi) away.</p>
                                <h4 className='mt-5'>Weather:</h4>
                                <p>Winters in Tadoba (November to February) have daytime temperatures of 25°-30°C. Summers are extremely hot, reaching up to 47°C, but are ideal for spotting mammals near lakes due to minimal vegetation. The monsoon starts in June, with heavy rainfall (approx. 1275 mm) and 66% humidity.</p>
                            </div>
                        </div>
                    </div>

                </section>

                {/* <div id="testimonial">
                    <ReviewSlider />
                </div> */}

            </div>
            {/* <div id="contact">
                <ContactSection />
            </div> */}
            <MainFooter />
            <LoginModal setLoginModalshow={setLoginModalshow} loginModalshow={loginModalshow} />

        </div>
    )
}

export default Home;