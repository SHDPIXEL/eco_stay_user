import React, { useState } from "react";
import ContactImg from "../assets/images/contact.png";
import Form from 'react-bootstrap/Form';
import { Button, FormControl } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ceoimg from "../assets/images/ceoimg.png";

const ContactSection = () => {

    const [value, setValue] = useState(1);

    const handleIncrement = () => setValue((prev) => prev + 1);
    const handleDecrement = () => setValue((prev) => (prev > 1 ? prev - 1 : 1));
    const handleChange = (e) => setValue(e.target.value ? parseInt(e.target.value, 10) : "");


    return (
        <div className="container-fluid py-5">
            <div className="contactSection">
                <div className="position-relative">
                    <div className="position-relative">
                    <img src={ContactImg} alt="contact" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="1856" height="780" className="svg-overlay" viewBox="0 0 1856 780" fill="none">
                        <path d="M1824 0H32C14.3269 0 0 14.3269 0 32V584.472C0 587.147 0.231225 589.875 1.54158 592.207C5.75708 599.709 17.9023 610 44 610H645C663.167 612.5 699.5 626.9 699.5 664.5V742.289C699.5 744.101 699.628 745.898 700.049 747.66C702.965 759.875 712.954 780 734.5 780H1824C1841.67 780 1856 765.673 1856 748V32C1856 14.3269 1841.67 0 1824 0Z" fill="url(#paint0_linear_2_56)" />
                        <defs>
                            <linearGradient id="paint0_linear_2_56" x1="928" y1="835.714" x2="928" y2="-4.98125e-05" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" stopOpacity="0" />
                                <stop offset="0.248723" stopOpacity="0" />
                                <stop offset="1" stopColor="#1E1E1E" />
                            </linearGradient>
                        </defs>
                    </svg>
                    </div>
                    
                    <div className="leftcontact">
                                    <p>Feel free to contact us for help with your stay and trip.</p>
                                    <h4>Submit your details,
                                        and our team will reach out
                                        to discuss about your stay</h4>
                                </div>
                    
                    <div className="contactcontains">
                       
                                <div className="contactformbg">
                                    <Form>
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <Form.Control size="lg" type="text" placeholder="* Your full name" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <Form.Control size="lg" type="number" placeholder="*Your mobile number" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <Form.Control size="lg" type="email" placeholder="*Your email ID" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <Form.Control
                                                    size="lg"
                                                    type="text"
                                                    // onFocus={(e) => (e.target.type = "date")}
                                                    // onBlur={(e) => (e.target.type = e.target.value ? "date" : "text")}
                                                    placeholder="*Check-In Date"
                                                    className="dateicon"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <Form.Control
                                                    size="lg"
                                                    type="text"
                                                    // onFocus={(e) => (e.target.type = "date")}
                                                    // onBlur={(e) => (e.target.type = e.target.value ? "date" : "text")}
                                                    placeholder="*Check-Out Date"
                                                    className="dateicon"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <Form.Group className="number-input">
                                                    <div>Single Occupancy</div>
                                                    <div className="d-flex align-items-center">
                                                        <Button variant="outline-secondary" onClick={handleDecrement}><i className="bi bi-dash"></i></Button>
                                                        <FormControl
                                                            type="number"
                                                            value={value}
                                                            onChange={handleChange}
                                                            min="1"
                                                            className="text-center"
                                                        />
                                                        <Button variant="outline-secondary" onClick={handleIncrement}><i className="bi bi-plus-lg"></i></Button>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <Form.Group className="number-input">
                                                    <div>Double Occupancy</div>
                                                    <div className="d-flex align-items-center">
                                                    <Button variant="outline-secondary" onClick={handleDecrement}><i className="bi bi-dash"></i></Button>
                                                        <FormControl
                                                            type="number"
                                                            value={value}
                                                            onChange={handleChange}
                                                            min="1"
                                                            className="text-center"
                                                        />
                                                        <Button variant="outline-secondary" onClick={handleIncrement}><i className="bi bi-plus-lg"></i></Button>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-12 mb-3  ">
                                                <Form.Group className="number-input">
                                                    <div>*Number of rooms</div>
                                                    <div className="d-flex align-items-center">
                                                    <Button variant="outline-secondary" onClick={handleDecrement}><i className="bi bi-dash"></i></Button>
                                                        <FormControl
                                                            type="number"
                                                            value={value}
                                                            onChange={handleChange}
                                                            min="1"
                                                            className="text-center"
                                                        />
                                                        <Button variant="outline-secondary" onClick={handleIncrement}><i className="bi bi-plus-lg"></i></Button>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-12 mb-3 text-dark">
                                            <Form.Group controlId="formBasicCheckbox" className="d-flex chekmarh">
                                                <Form.Check size="lg" type="checkbox"  /><span>By clicking the button, you accept the terms of the <Link to="/">Privacy Policy</Link> and the <Link to="/">Terms & Conditions</Link></span>
                                            </Form.Group>
                                            </div>
                                            <div className="col-md-12 mb-3 text-dark">
                                            <Button className="w-100 bookcombtn" type="submit">Submit</Button>
                                                </div>

                                        </div>

                                    </Form>
                               
                            
                        </div>
                    </div>
                    <div className="contactfoot">
                        <div><img src={ceoimg} alt='ceo' /></div>
                        <div className="siderightcontact">
                            <h4>We will do our best to get back to you as soon as possible</h4>
                            <p>Paras Savla  |  Founder of Vrruksh Eco Stay</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ContactSection;