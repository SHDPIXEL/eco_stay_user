import React, { useState } from "react";
import ContactImg from "../assets/images/contact.png";
import Form from 'react-bootstrap/Form';
import { Button, FormControl } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ceoimg from "../assets/images/ceoimg.png";
import API from "../api";

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 1,
        rooms: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "adults" || name === "children" || name === "rooms" ? Math.max(1, parseInt(value, 10) || 1) : value
        });
    };

    const handleIncrement = (field) => {
        setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
    };

    const handleDecrement = (field) => {
        setFormData((prev) => ({ ...prev, [field]: Math.max(1, prev[field] - 1) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("enquiries/enquiry", formData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                alert("Inquiry submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            alert("Failed to submit inquiry. Please try again.");
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="contactSection">
                <div className="position-relative">
                    <img src={ContactImg} alt="contact" />
                    <div className="leftcontact">
                        <p>Feel free to contact us for help with your stay and trip.</p>
                        <h4>Submit your details, and our team will reach out to discuss about your stay</h4>
                    </div>

                    <div className="contactcontains">
                        <div className="contactformbg">
                            <Form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <Form.Control name="name" value={formData.name} onChange={handleChange} size="lg" type="text" placeholder="* Your full name" required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} size="lg" type="number" placeholder="*Your mobile number" required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="email" value={formData.email} onChange={handleChange} size="lg" type="email" placeholder="*Your email ID" required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="checkInDate" value={formData.checkInDate} onChange={handleChange} size="lg" type="date" placeholder="*Check-In Date" required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} size="lg" type="date" placeholder="*Check-Out Date" required />
                                    </div>

                                    {/* Children (Single Occupancy) */}
                                    <div className="col-md-6 mb-3">
                                        <Form.Group className="number-input">
                                            <div>Total Children</div>
                                            <div className="d-flex align-items-center">
                                                <Button variant="outline-secondary" onClick={() => handleDecrement("children")}><i className="bi bi-dash"></i></Button>
                                                <FormControl name="children" value={formData.children} onChange={handleChange} type="number" min="1" className="text-center" />
                                                <Button variant="outline-secondary" onClick={() => handleIncrement("children")}><i className="bi bi-plus-lg"></i></Button>
                                            </div>
                                        </Form.Group>
                                    </div>

                                    {/* Adults (Double Occupancy) */}
                                    <div className="col-md-6 mb-3">
                                        <Form.Group className="number-input">
                                            <div>Total Adults</div>
                                            <div className="d-flex align-items-center">
                                                <Button variant="outline-secondary" onClick={() => handleDecrement("adults")}><i className="bi bi-dash"></i></Button>
                                                <FormControl name="adults" value={formData.adults} onChange={handleChange} type="number" min="1" className="text-center" />
                                                <Button variant="outline-secondary" onClick={() => handleIncrement("adults")}><i className="bi bi-plus-lg"></i></Button>
                                            </div>
                                        </Form.Group>
                                    </div>

                                    {/* Number of Rooms */}
                                    <div className="col-md-12 mb-3">
                                        <Form.Group className="number-input">
                                            <div>*Number of rooms</div>
                                            <div className="d-flex align-items-center">
                                                <Button variant="outline-secondary" onClick={() => handleDecrement("rooms")}><i className="bi bi-dash"></i></Button>
                                                <FormControl name="rooms" value={formData.rooms} onChange={handleChange} type="number" min="1" className="text-center" />
                                                <Button variant="outline-secondary" onClick={() => handleIncrement("rooms")}><i className="bi bi-plus-lg"></i></Button>
                                            </div>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-12 mb-3 text-dark">
                                        <Form.Group controlId="formBasicCheckbox" className="d-flex chekmarh">
                                            <Form.Check size="lg" type="checkbox" required /><span>By clicking the button, you accept the terms of the <Link to="/">Privacy Policy</Link> and the <Link to="/">Terms & Conditions</Link></span>
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
};

export default ContactSection;
