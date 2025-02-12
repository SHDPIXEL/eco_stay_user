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

    const [errors, setErrors] = useState({});


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

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Full name is required";
        if (!formData.mobile) newErrors.mobile = "Mobile number is required";
        else if (formData.mobile.length !== 10) newErrors.mobile = "Mobile number must be 10 digits";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.checkInDate) newErrors.checkInDate = "Check-in date is required";
        if (!formData.checkOutDate) newErrors.checkOutDate = "Check-out date is required";
        else if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) newErrors.checkOutDate = "Check-out date must be later than check-in date";
        if (formData.adults < 1) newErrors.adults = "At least one adult is required";
        if (formData.rooms < 1) newErrors.rooms = "At least one room is required";
        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            const response = await API.post("enquiries/enquiry", formData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200 || response.status === 201) {
                alert("Inquiry submitted successfully!");
                setFormData({
                    name: "",
                    mobile: "",
                    email: "",
                    checkInDate: "",
                    checkOutDate: "",
                    adults: 1,
                    children: 1,
                    rooms: 1,
                });

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
                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} size="lg" type="tel" placeholder="*Your mobile number" required />
                                        {errors.mobile && <div className="text-danger">{errors.mobile}</div>}

                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="email" value={formData.email} onChange={handleChange} size="lg" type="email" placeholder="*Your email ID" required />
                                        {errors.email && <div className="text-danger">{errors.email}</div>}

                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="checkInDate" value={formData.checkInDate} onChange={handleChange} size="lg" type="date" placeholder="*Check-In Date" required />
                                        {errors.checkInDate && <div className="text-danger">{errors.checkInDate}</div>}

                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Control name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} size="lg" type="date" placeholder="*Check-Out Date" required />
                                        {errors.checkOutDate && <div className="text-danger">{errors.checkOutDate}</div>}

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
                                        {errors.adults && <div className="text-danger">{errors.adults}</div>}

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
                                        {errors.rooms && <div className="text-danger">{errors.rooms}</div>}

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
