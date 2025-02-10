import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ceoimg from "../assets/images/ceoimg.png";
import { Button, Form, Row, Col } from "react-bootstrap";
import trustimg from "../assets/images/trustimg.png";
import ReviewModal from "./ReviewModal";
import API from "../api";
import { AuthContext } from "../context/AuthContext";



const Checkouts = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [ReviewModalshow, setReviewModalshow] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({});
  const [otpExpired, setOtpExpired] = useState(false);
  const [timer, setTimer] = useState(120); // 5 minutes in seconds
  const [errorMessage, setErrorMessage] = useState("");
  const [otpVerifiedMessage, setOtpVerifiedMessage] = useState("");
  const [isPaymentChecked, setIsPaymentChecked] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isTokenExpired, login } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    u_id: "", // Initialize with u_id
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  // console.log("Agent booking for user data", profileData)
  const [idProofFile, setIdProofFile] = useState(null);
  const [isDisable, setIsDisable] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setErrorMessage(""); // ✅ Clear error when checkbox is checked
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIdProofFile(file);
  };

  useEffect(() => {
    const type = localStorage.getItem("type");
    if (type === "agent") {
      setIsDisable(false); // Enable the input if type is "agent"
    } else {
      setIsDisable(true); // Ensure it is disabled otherwise
    }
  }, []);

  useEffect(() => {
    let interval;
    if (showVerify && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setOtpExpired(true);
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showVerify, timer]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.post("/auth/user/user-data"); // Fetch based on u_id
        setProfileData(response.data);
        console.log("profile data", response.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const userType = localStorage.getItem("type");
    if (isAuthenticated && !isTokenExpired()) {
      if (userType === "user") {
        fetchUserData();
      } else if (userType === "agent") {
        setProfileData({
          // u_id: "",
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        });
      }
    }
  }, [isAuthenticated, isTokenExpired]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const resendOTP = async () => {
    setOtpExpired(false);
    setTimer(120);
    setOtp("");
    setErrorMessage("");

    try {
      const response = await API.post("/auth/user/booking_register", formData);
      if (response.status === 200) {
        setShowVerify(true);
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setFormErrors({
        submit: error.response?.data?.message || "Error resending OTP " + error,
      });
    }
  };

  // Extract all the booking details from location state
  const {
    checkInDate,
    checkOutDate,
    selectedRoom,
    selectedOption,
    selectedPackage,
    selectedCottages,
    roomName,
    roomId,
    occupancyType,
    packageName,
    basePrice,
    packagePrice,
    totalNights,
    pricePerNight,
    grandTotal,
    gstRate,
    discountPercentage,
    discountPrice,
    newGrandTotal,
    gstAmount,
    finalAmount,
    newPrice,
    formattedCheckInDate,
    formattedCheckOutDate,
  } = location.state || {};

  // Redirect if any required data is missing

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.firstname.trim()) errors.firstname = "First name is required";
    if (!formData.lastname.trim()) errors.lastname = "Last name is required";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Mobile number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.pincode.trim()) errors.pincode = "PIN code is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (formData.phoneNumber && !mobileRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Mobile number must be 10 digits";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log("form data object:", formDataObj)

    const errors = validateForm(formDataObj);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await API.post(
          "/auth/user/booking_register",
          formDataObj
        );
        if (response.status === 200) {
          setFormData(formDataObj);
          setShowVerify(true);
          setShowDetails(true);
          setTimer(120);
          setOtpExpired(false);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormErrors({
          submit:
            error.response?.data?.message || "Error submitting form " + error,
        });
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpExpired) {
      setErrorMessage("OTP has expired. Please request a new one.");
      return;
    }
    try {
      const verifyData = {
        otp: otp,
        ...formData, // Include all previously collected form data
      };
      const response = await API.post(
        "/auth/user/booking_register",
        verifyData
      );
      if (response.status === 200) {
        setShowVerify(false);
        const token = response.data.token; // Assuming the token is in response.data.token
        login(token);
        setProfileData(response.data.user);
        console.log("use data on login", response.data)
        setOtpVerifiedMessage("OTP Verified successfully!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setFormErrors({
        submit: error.response?.data || "Error verifying OTP " + error.message,
      });
    }
  };


  const handleProceed = () => {
    const userType = localStorage.getItem("type");

    if (userType !== "agent") {
      // If not an agent, directly show details
      setShowDetails(true);
      return;
    }

    // If user is an agent, validate fields (excluding idProof)
    const { idProof, ...restProfileData } = profileData;
    console.log(profileData);
    console.log(restProfileData);

    const values = Object.values(restProfileData);
    const isValid = values.every((value) => value && value.trim() !== "");

    if (isValid) {
      setShowDetails(true);
    } else {
      alert("Please fill in all the details before proceeding.");
    }
  };


  const openReviewModal = () => {
    setReviewModalshow(true);
    document.body.style.overflow = "hidden";
  };

  async function payment_init(e) {

    e.preventDefault();

    if (!isChecked) {
      setErrorMessage("Please check the terms and conditions to proceed."); // ✅ Show error message
      return;
    }
    console.log("error messsage", errorMessage)

    setErrorMessage(""); // ✅ Clear error when checkbox is checked

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // const result = await API.post("/auth/user/booking/orders", {
    //   amt: finalAmount.toFixed(2),
    //   currency: "INR",
    //   checkInDate,
    //   checkOutDate,
    //   roomType: roomName,
    //   number_of_cottages: selectedCottages,
    //   selected_packages: selectedPackage.name,
    //   selected_occupancy: occupancyType,
    //   base_price: basePrice,
    //   package_price: packagePrice,
    //   total_nights: totalNights,
    //   price_per_night: pricePerNight,
    //   grand_total: grandTotal
    // });


    const userType = localStorage.getItem("type");
    const bookingPayload =
      userType === "agent" ?
        {
          amt: finalAmount.toFixed(2),
          currency: "INR",
          checkInDate,
          checkOutDate,
          roomType: roomName + '_' + roomId,
          number_of_cottages: selectedCottages,
          selected_packages: selectedPackage.name,
          selected_occupancy: occupancyType,
          base_price: basePrice,
          package_price: packagePrice,
          total_nights: totalNights,
          price_per_night: pricePerNight,
          grand_total: grandTotal,
          u_id: profileData.u_id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          pincode: profileData.pincode,
        } : {
          amt: finalAmount.toFixed(2),
          currency: "INR",
          checkInDate,
          checkOutDate,
          roomType: roomName + '_' + roomId,
          number_of_cottages: selectedCottages,
          selected_packages: selectedPackage.name,
          selected_occupancy: occupancyType,
          base_price: basePrice,
          package_price: packagePrice,
          total_nights: totalNights,
          price_per_night: pricePerNight,
          grand_total: grandTotal,
        }

    const result = await API.post("/auth/user/booking/orders", bookingPayload);

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    console.log(result.data.bookingDetails);
    console.log(result.data.bookingDetails.id);
    const { amount, id: order_id, currency } = result.data.order;
    const { id: booking_id } = result.data.bookingDetails;

    const options = {
      key: "rzp_test_G0gvgyqODDYfyq", // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: currency,
      name: "Eco Stay - Vrruksh",
      description: "Payment for room booking",
      image: "https://www.metamatrixtech.com/img/favicon.webp",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          booking: booking_id,
          amount,
        };

        console.log("data before posting", data)
        const result = await API.post("auth/user/booking/success", data);
        console.log("payment successfully created", result.data)
        // console.log(result.data);
        // alert(result.data.msg);
        // console.log("pament success check", result.data.msg)
        // navigate("/thankyou")        
        if (result.data.paymentDetails.status === "success") {
          console.log("result status", result.data.status)
          const bookingIdStr = String(result.data.bookingId);  // Ensure booking_id is a string

          // Get current date and time
          const currentDate = new Date();
          const epochTime = currentDate.getTime();  // Get the current time in epoch format (milliseconds)

          // Combine booking_id, current date/time, and epoch time
          const combinedString = `${bookingIdStr}-${currentDate.toISOString()}-${epochTime}`;

          // Encode the combined string
          const encodedBookingId = btoa(combinedString);  // Base64 encode the string

          navigate(`/thankyou?id=${encodedBookingId}`, {
            state: {
              paymentDetails: result.data.paymentDetails,
            },
          });

          console.log("from checkout", result.data.paymentDetails)
        } else navigate('/');


      },
      prefill: {
        name: profileData.name,
        email: profileData.email,
        contact: profileData.phone,
      },
      notes: {
        address: profileData.address,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="checkoutbox">
              <div className="d-flex align-items-center">
                <div>
                  {" "}
                  <img src={ceoimg} alt="" />
                </div>
                <div className="ms-3 w-100">
                  <div className="d-flex justify-content-between">
                    <h5>Checkout</h5>{" "}
                    <div>
                      <Link to="/book-your-stay" className="actionicon px-3">
                        <i className="bi bi-arrow-left"></i> Back
                      </Link>
                    </div>
                  </div>
                  <h6>Choose the best eco-stay resorts in India.</h6>
                  <p>Paras Savla | Founder of Vrruksh Eco Stay</p>
                </div>
              </div>
            </div>
            <div className="row my-4 mx-0">
              <div className="starrates">
                <div className="starrateimg">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p>5 out of 5. See all 300+ reviews on Trip Advisor.</p>
                <h6>"Outstanding experience with Virya Wildlife Tours"</h6>
              </div>
            </div>
            {!isAuthenticated || isTokenExpired() ? (
              <>
                <div className="bellinginformation">
                  <div className="d-flex justify-content-between">
                    <h4 className="text-color">
                      1. Account/Billing Information
                    </h4>
                    {showDetails && (
                      <div
                        className="actionicon"
                        onClick={() => setShowDetails(false)}
                      >
                        <i className="bi bi-pencil-fill"></i>{" "}
                        <em>
                          Edit{" "}
                          <em className="d-md-inline-block d-none">details</em>
                        </em>
                      </div>
                    )}
                  </div>
                  <div className={showDetails ? "d-block" : "d-none"}>
                    <div className="billnameDetails">
                      <h6>
                        {formData.firstname} {formData.lastname}
                      </h6>
                      <p>
                        {formData.address}, {formData.city}, {formData.state},{" "}
                        {formData.country} - {formData.pincode}
                      </p>
                    </div>
                  </div>
                  <Form
                    onSubmit={handleSubmit}
                    className={showDetails ? "d-none" : "d-block"}
                  >
                    <div className="row">
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group className="inputlabel" controlId="name">
                            <Form.Label>
                              <span className="text-color">* </span>First Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="firstname"
                              className="controlinput"
                              placeholder="Enter First Name"
                              isInvalid={!!formErrors.firstname}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.firstname}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group
                            className="inputlabel"
                            controlId="lastname"
                          >
                            <Form.Label>
                              <span className="text-color">* </span>Last Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="lastname"
                              className="controlinput"
                              placeholder="Enter Last Name"
                              isInvalid={!!formErrors.lastname}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.lastname}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group
                            className="inputlabel"
                            controlId="phoneNumber"
                          >
                            <Form.Label>
                              <span className="text-color">* </span>Mobile
                              Number
                            </Form.Label>
                            <div className="controlinput">
                              <span>+91</span>
                              <Form.Control
                                type="tel"
                                className="mobileinput"
                                name="phoneNumber"
                                placeholder="Enter Mobile Number"
                                isInvalid={!!formErrors.phoneNumber}
                              />
                            </div>
                            <Form.Control.Feedback type="invalid">
                              {formErrors.phoneNumber}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group
                            className="inputlabel"
                            controlId="EmailID"
                          >
                            <Form.Label>
                              <span className="text-color">* </span>Email ID
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              className="controlinput"
                              placeholder="Enter Email ID"
                              isInvalid={!!formErrors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="forminput">
                          <Form.Group className="inputlabel" controlId="name">
                            <Form.Label>
                              <span className="text-color">* </span>Your
                              Complete Address
                            </Form.Label>
                            <div className="controlinput">
                              <Form.Control
                                type="text"
                                name="address"
                                className="Addressinput"
                                placeholder="Enter your complete address"
                                isInvalid={!!formErrors.address}
                              />
                              <span className="loacte">
                                <i className="bi bi-geo-alt-fill"></i> Locate Me
                              </span>
                            </div>
                            <Form.Control.Feedback type="invalid">
                              {formErrors.address}
                            </Form.Control.Feedback>
                            <p className="text-muted my-1">
                              This address will be added to your booking
                              invoice. We make sure, all your information is
                              confidential.
                            </p>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group className="inputlabel" controlId="city">
                            <Form.Label>
                              <span className="text-color">* </span>City
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              className="controlinput"
                              placeholder="Enter City"
                              isInvalid={!!formErrors.city}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.city}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group className="inputlabel" controlId="state">
                            <Form.Label>
                              <span className="text-color">* </span>State
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              className="controlinput"
                              placeholder="Enter State"
                              isInvalid={!!formErrors.state}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.state}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group
                            className="inputlabel"
                            controlId="country"
                          >
                            <Form.Label>
                              <span className="text-color">* </span>Country
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="country"
                              className="controlinput"
                              placeholder="Enter Country"
                              isInvalid={!!formErrors.country}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.country}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="forminput">
                          <Form.Group className="inputlabel" controlId="Postal">
                            <Form.Label>
                              <span className="text-color">* </span>Postal Code/
                              PIN Code
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="pincode"
                              className="controlinput"
                              placeholder="Enter your PIN Code"
                              isInvalid={!!formErrors.pincode}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.pincode}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      {/* <div className="col-md-12 mt-3">
                        <div className="forminput">
                          <Form.Group className="inputlabel" controlId="idProof">
                            <Form.Label>
                              <span className="text-color">* </span>Upload Your ID Proof
                            </Form.Label>
                            <div className="controlinput fileInput">
                              <div className="uploadinput">
                                Upload Passport, Aadhar, or Driving License (ANYONE)
                              </div>
                              <span className="uploadloacte">
                                <input
                                  type="file"
                                  name="idProof"
                                  className="d-none"
                                  id="idProofInput"
                                  accept="image/*,application/pdf"
                                  onChange={handleFileChange}
                                />
                                <label htmlFor="idProofInput" className="placeuploads">
                                  <i className="bi bi-upload ms-2"></i> Click Here to Upload ID Proof File
                                </label>
                              </span>
                            </div>

                            {idProofFile && (
                              <div className="uploaded-file mt-2">
                                <strong>Attached File:</strong> {idProofFile.name}
                                {idProofFile.type.startsWith("image/") && (
                                  <div className="image-preview mt-2">
                                    <img
                                      src={URL.createObjectURL(idProofFile)}
                                      alt="ID Proof Preview"
                                      style={{ width: "150px", height: "auto", borderRadius: "5px" }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            <p className="text-muted my-1 mb-0">
                              If you upload your ID Proof (Passport, Aadhar, or Driving License), you won’t be asked for your ID proof at the time of Check-In at the property. We ensure all your information is confidential.
                            </p>
                          </Form.Group>
                        </div>
                      </div> */}

                      {formErrors.submit && (
                        <div className="col-md-12 mt-3">
                          <div className="alert alert-danger">
                            {formErrors.submit}
                          </div>
                        </div>
                      )}
                      <div className="col-md-6">
                        <Button
                          className="bookcombtn booknowbtn w-100"
                          type="submit"
                        >
                          Proceed
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
                <div className="bellinginformation mt-3">
                  <h4 className="text-color mb-0">2. Verify Details</h4>
                  {showVerify && (
                    <div className="verifydetails mt-3">
                      <div className="col-md-12">
                        <p>
                          Verify your mobile number using OTP. We have sent an
                          SMS with 6-digits OTP on your mobile number +91...
                        </p>
                        <p>Time remaining: {formatTime(timer)}</p>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <Form onSubmit={handleVerifyOtp}>
                            <Form.Group className="mb-3">
                              <Form.Label>* OTP</Form.Label>
                              <div className="formlogininput">
                                <Form.Control
                                  type="number"
                                  size="lg"
                                  className="logininput"
                                  placeholder="Enter 6-digit OTP"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  disabled={otpExpired}
                                />
                              </div>
                            </Form.Group>
                            {errorMessage && (
                              <p className="text-danger">{errorMessage}</p>
                            )}
                            <Button
                              className="bookcombtn w-100 mt-0 verifybtn"
                              type="submit"
                              disabled={otpExpired}
                            >
                              Verify OTP
                            </Button>
                            {otpExpired && (
                              <Button
                                className="bookcombtn w-100 mt-2"
                                onClick={resendOTP}
                              >
                                Resend OTP
                              </Button>
                            )}
                          </Form>
                        </div>
                        {formErrors.submit && (
                          <div className="col-md-12 mt-3">
                            <div className="alert alert-danger">
                              {formErrors.submit}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="bellinginformation mt-3">
                  <h4 className="text-color mb-0">User Details</h4>
                  <Row className="mb-3 mt-3">
                    <Col md={6}>
                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formName"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "end" }}
                            >
                              Name:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.name}
                              placeholder="Enter Your Name"
                              disabled={isDisable}
                              required
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} // Handle input change
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formPhone"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "end" }}
                            >
                              Phone:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.phone}
                              disabled={isDisable}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} // Handle input change
                              readOnly={isDisable}
                              required
                              placeholder="Enter your phone number"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formAddress"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "end" }}
                            >
                              Address:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.address}
                              placeholder="Enter Your Address"
                              disabled={isDisable}
                              required
                              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} // Handle input change

                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formEmail"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "flex-end" }}
                            >
                              Email:
                            </Form.Label>
                            <Form.Control
                              type="email"
                              value={profileData.email}
                              placeholder="Enter Your Email"
                              disabled={isDisable}
                              required
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} // Handle input change
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col md={6}>
                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formCity"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "end" }}
                            >
                              City:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.city}
                              placeholder="Enter Your City"
                              disabled={isDisable}
                              required
                              onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} // Handle input change
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formState"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "end" }}
                            >
                              State:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.state}
                              placeholder="Enter Your State"
                              disabled={isDisable}
                              required
                              onChange={(e) => setProfileData({ ...profileData, state: e.target.value })} // Handle input change     
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formCountry"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "end" }}
                            >
                              Country:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.country}
                              placeholder="Enter Your Country"
                              disabled={isDisable}
                              required
                              onChange={(e) => setProfileData({ ...profileData, country: e.target.value })} // Handle input change
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col>
                          <Form.Group
                            controlId="formPincode"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Form.Label
                              style={{ width: "50%", alignContent: "end" }}
                            >
                              Pincode:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.pincode}
                              placeholder="Enter Your Pincode"
                              disabled={isDisable}
                              required
                              onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })} // Handle input change
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <button
                        // onClick={() => setShowDetails(true)}
                        onClick={handleProceed}
                        className="bookcombtn booknowbtn w-100"
                      >
                        Proceed with these details
                      </button>
                    </Col>
                    <Col md={6}>
                      <Link
                        to="/dashboard"
                        className="bookcombtn booknowbtn w-100"
                      >
                        Update Profile
                      </Link>
                    </Col>
                  </Row>
                </div>
              </>
            )}

            <div className="bellinginformation mt-3">
              <h4 className="text-color mb-0">Payment</h4>
              {showDetails && (
                <div className="paymentcheck mt-3">
                  <div className="row">
                    <div className="col-md-12">
                      {otpVerifiedMessage && (
                        <div className="col-md-12 mt-3">
                          <div className="alert alert-success">
                            {otpVerifiedMessage}
                          </div>
                        </div>
                      )}
                      <Form>
                        <Form.Group
                          controlId="formBasicCheckbox"
                          className="d-flex paymentcheckmark"
                        >
                          <Form.Check
                            size="lg"
                            type="checkbox"
                            name="proc_payment"
                            onChange={handleCheckboxChange}
                          />
                          <span>
                            By proceeding, I agree to Vrruksh Eco Stay's{" "}
                            <Link to="/">User Agreement, </Link> and the{" "}
                            <Link to="/">Terms of Service</Link> and{" "}
                            <Link>
                              {" "}
                              Cancellation & Property Booking Policies.
                            </Link>
                          </span>
                          {/* {errorMessage && <p style={{ color: "red", marginTop: "5px" }}>{errorMessage}</p>} */}
                        </Form.Group>
                      </Form>
                    </div>
                    <div className="col-md-6 col-12">
                      <button
                        className="bookcombtn booknowbtn w-100"
                        onClick={payment_init}
                        // disabled={!isChecked}
                      >
                        {" "}
                        Proceed to pay{" "}
                      </button>

                      {/* ✅ Show error message under the button */}
                      {errorMessage && (
                        <p style={{ color: "red", marginTop: "5px", textAlign: "center" }}>
                          {errorMessage}
                        </p>
                      )}

                    </div>
                    <div className="col-md-2 mt-3 col-12 ">
                      <img src={trustimg} alt="" className="imgtrust" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="PriceBox w-100 position-sticky">
              <div className="SubPriceBox">
                <h3 className="text-color">Price Breakup</h3>
                <hr />
                <div className="roomcaldiv">
                  <div className="leftRoomPrice">
                    <h5>
                      {selectedCottages} Cottage X {totalNights} Nights
                    </h5>
                    <p style={{ textTransform: "capitalize" }}>
                      ({selectedRoom?.room_name} {selectedPackage?.name})
                    </p>
                  </div>
                  <div className="rightRoomPrice">
                    ₹ {newGrandTotal.toFixed(2)}
                  </div>
                </div>

                <div className="TotalDiscountDiv">
                  <div className="leftTotalDiscount text-color">
                    <h5>
                      Total Discount{" "}
                      <i
                        className="bi bi-info-circle h6"
                        onClick={() => alert(`${discountPercentage}% Off`)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </h5>
                  </div>
                  <div className="rightTotalDiscount text-color">
                    {" "}
                    ₹ {discountPrice.toFixed(2)}
                  </div>
                </div>
                <hr />
                <div className="PriceafterDiv">
                  <div className="leftPriceafter">
                    <h5>Price after Discount</h5>
                  </div>
                  <div className="rightPriceafter">
                    ₹ {grandTotal.toFixed(2)}
                  </div>
                </div>
                <hr />
                <div className="taxDiv">
                  <div className="lefttax">
                    <h5>
                      Taxes & Service Fees{" "}
                      <i
                        className="bi bi-info-circle h6"
                        onClick={() =>
                          alert(
                            `${gstRate * 100
                            }% GST\nService Charges\nBooking Fees\nConvenience Fees`
                          )
                        }
                        style={{ cursor: "pointer" }}
                      ></i>
                    </h5>
                  </div>
                  <div className="righttax">₹ {gstAmount.toFixed(2)}</div>
                </div>
                <hr />
                <div className="finalamtDiv">
                  <div className="leftfinalamt text-color">
                    <h5>Total Amount to be paid</h5>
                  </div>
                  <div className="rightfinalamt text-color">
                    ₹ {finalAmount.toFixed(2)}
                  </div>
                </div>
                <div
                  className="bookcombtn booknowbtn w-100"
                  onClick={openReviewModal}
                >
                  Review booking
                </div>
              </div>
              <div className="qualitydiv mt-3 text-center ">
                <h6>
                  <i
                    className="bi bi-shield-fill-check "
                    style={{ color: "#579542" }}
                  ></i>{" "}
                  Quality You Can Trust
                </h6>
                <p className="w-75 m-auto d-table">
                  We are available 24/7/365 to answer your questions and help
                  you better understand your Booking.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="copyright">© 2024. VIRYA WILDLIFE TOURS LLP.</p>
      </div>
      <ReviewModal
        newPrice={newPrice}
        ReviewModalshow={ReviewModalshow}
        setReviewModalshow={setReviewModalshow}
        checkInDate={formattedCheckInDate}
        checkOutDate={formattedCheckOutDate}
        selectedRoom={selectedRoom}
        selectedPackage={selectedPackage}
        selectedCottages={selectedCottages}
        basePrice={basePrice}
        packagePrice={packagePrice}
        occupancyType={occupancyType}
        pricePerNight={pricePerNight}
      />
    </>
  );
};
export default Checkouts;
