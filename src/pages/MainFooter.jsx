import React from 'react';
import footerimg from '../assets/images/footerabout.png';
import logo from "../assets/images/logo.png";
import { Link, useNavigate } from 'react-router-dom';

const MainFooter = () => {

    const navigate = useNavigate();

    const handleScrollToSection = (path, sectionId) => {
        navigate(path);
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              const offset = window.innerWidth <= 768 ? 300 : 100; 
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - offset;
      
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }, 100);
    };
    return (
        <>
            <div className="container-fluid mt-5 mb-4">
                <div className="footersection">
                    <div className="row g-5">
                        <div className='col-md-6'>
                            <div className='position-relative'>
                                <img src={footerimg} alt='footimg' />
                                <div className='footerimgcontain'>
                                    <img src={logo} alt='logo' />
                                    <h3>Providing conscious effort to give you a best stays, in nature.</h3>
                                    <p>© 2024. VIRYA WILDLIFE TOURS LLP.</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='row border-bottoms pb-3'>
                                <div className='col-md-4 col-6'>
                                    <div className='footernav'>
                                        <h5>Navigation</h5>
                                        <div className='botnav'>
                                            <Link onClick={() => handleScrollToSection("/", "about")} >About Us</Link>
                                            <Link onClick={() => handleScrollToSection("/", "whychoos")} >Why Choose Us?</Link>
                                            <Link onClick={() => handleScrollToSection("/", "rooms")} >Rooms</Link>
                                            <Link onClick={() => handleScrollToSection("/", "facilities")} >Facilities</Link>
                                            <Link onClick={() => handleScrollToSection("/", "testimonials")} >Reviews</Link>
                                            <Link onClick={() => handleScrollToSection("/", "contact")} >Contact</Link>
                                            <Link to="/bookYourStaypage">Book Your Stay</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-8 col-6'>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className='footernav'>
                                                <h5>Type of Stays</h5>
                                                <div className='botnav'>
                                                    <Link onClick={() => handleScrollToSection("/", "rooms")}>Mud Block Cottages</Link>
                                                    <Link onClick={() => handleScrollToSection("/", "rooms")}>Median Tents</Link>
                                                    <Link onClick={() => handleScrollToSection("/", "rooms")}>Colossal Tents</Link>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className='footernav'>
                                                <h5>Explore More</h5>
                                                <div className='botnav'>
                                                    <Link to="/">Virya Wildlife Tours</Link>
                                                    <Link to="/">Vrruksh Safaris</Link>
                                                    <Link to="/">Vrruksh Holidays</Link>

                                                </div>
                                            </div>
                                            <div className='row mt-md-5 pt-md-3'>
                                                <div className='col-md-12'>
                                                    <div className='footsociallink'>
                                                        <Link to="/"><i className="bi bi-instagram"></i></Link>
                                                        <Link to="/"><i className="bi bi-facebook"></i></Link>

                                                        <Link to="/"><i className="bi bi-twitter"></i></Link>
                                                        <Link to="/"><i className="bi bi-youtube"></i></Link>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>

                            </div>
                            <div className='row border-bottoms'>
                                <div className='col-md-6'>
                                    <div className='contactinfo'>
                                        <h4>Contacts</h4>
                                        <Link to='mailto:info@viryawildlifetours.com'>info@viryawildlifetours.com</Link>
                                        <Link to='tel:+919870370353'>+91 9870 37 0353</Link>
                                        <Link to='tel:++919870474063'>+91 9870 47 4063</Link>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='contactinfo'>
                                        <h4>Address</h4>
                                        <Link>501, Floor 5, Plot No.345, Chandavar-kar Cross Road, Mumbai – 400019.</Link>
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='footerprivacylink'>
                                        <ul>
                                            <li><Link to="/">Privacy Policies</Link></li>
                                            <li><i className="bi bi-circle-fill"></i></li>
                                            <li><Link to="/">Terms & Conditions</Link></li>
                                            <li><i className="bi bi-circle-fill"></i></li>
                                            <li><Link to="/">Cancellation & Refund Policy</Link></li>
                                        </ul>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainFooter;