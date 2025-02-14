import React, { useState, useEffect, useContext } from "react";
import API from "../api";
import Loginimg from "../assets/images/Loginimg.png";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import googliconimg from "../assets/images/Googleicon.png";
import agenticon from "../assets/images/agenticon.png";
import VerifyLoginModal from "./VerifyLoginModal";
import { Link, useAsyncError } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";


const LoginModal = (props) => {
    const { loginModalshow, setLoginModalshow } = props;
    const [verifyModalshow, setVerifyModalshow] = useState(false);
    const [mobileNumber, setMobileNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpSentMessage, setOtpSentMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);
    const [googleUserData, setGoogleUserData] = useState(null);
    const [mobileNumberGoogle, setMobileNumberGoogle] = useState("");


    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [loginModalshow]);

    const showVerify = () => {
        setVerifyModalshow(true);
        setLoginModalshow(false);
    }

    // const handleGoogleLogin = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, googleProvider);
    //         const user = result.user;

    //         // Extract user details
    //         const userData = {
    //             name: user.displayName,
    //             email: user.email,
    //             idProof: user.uid,
    //             phone: "", 
    //         };

    //         setGoogleUserData(userData);
    //         setShowPhoneNumberModal(true); 
    //     } catch (error) {
    //         console.error("Google login error:", error);
    //         setErrorMessage("Failed to log in with Google. Please try again.");
    //     }
    // };


    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
    
            // Extract user details
            const userData = {
                name: user.displayName,
                email: user.email,
                idProof: user.uid,
            };
            const response = await API.post("/auth/user/byEmail", userData);
            console.log("response google login", response.data)
            console.log("modal response", response.data.modal)
    
            if (response.status === 200) {
                const existingUser = response.data.modal;

                if (existingUser === false) {
                    login(response.data.token, "user");
                    setIsLoggedIn(true);
                    setLoginModalshow(false);
                } else {
                    setGoogleUserData(userData);
                    setShowPhoneNumberModal(true);
                }
            }
        } catch (error) {
            console.error("Google login error:", error);
            setErrorMessage("Failed to log in with Google. Please try again.");
        }
    };
    

    const handlePhoneNumberSubmit = async () => {
        if (!mobileNumberGoogle) {
            setErrorMessage("Please enter a valid phone number.");
            return;
        }

        try {
            const userDataWithPhone = { ...googleUserData, phone: mobileNumberGoogle };
            console.log("hitting the google-loing api")
            const response = await API.post("/auth/user/user/google-login", userDataWithPhone);
            console.log("after hitting the google-login api")

            console.log("google login response", response)
            console.log("gooel login response data", response.data)

            if (response.status === 200) {
                const { token } = response.data;
                console.log("response token", token)
                login(token, "user");
                setIsLoggedIn(true);
                setShowPhoneNumberModal(false);
                setLoginModalshow(false);
            }
        } catch (error) {
            console.error("Error updating phone number:", error);
            setErrorMessage("Failed to update phone number. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors
        setIsSendingOtp(true); // Start sending OTP
        setOtpSentMessage(""); // Clear any previous OTP sent message

        try {
            const response = await API.post("/auth/user/send-otp", {
                phoneNumber: mobileNumber,
            });

            if (response.status === 200) {
                setOtpSentMessage("OTP sent successfully!"); // Show success message
                setIsSendingOtp(false); // Reset OTP sending state
                showVerify(); // Show Verify Login Modal

            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setIsSendingOtp(false); // Reset OTP sending state on error
            setErrorMessage(
                error.response?.data?.message || "Failed to send OTP. Please try again."
            );
        }
    };

    return (
        <>
            <div className={loginModalshow ? "overlayLoginModal d-block" : "overlayLoginModal"}></div>
            <div className={loginModalshow ? "rightAuthModal show" : "rightAuthModal"}>
                <div className="authmodal">
                    <img src={Loginimg} alt="Login" />
                    <div className="AuthcloseIcon" onClick={() => setLoginModalshow(false)}><i className="bi bi-x-circle-fill"></i></div>
                </div>
                <div className="Authcontente">
                    <h4>Login/ Register to Track All Updates</h4>
                    <p>Login/ Register to enjoy our seamless services. This will help us to communicate better and  share booking invoices with you. You can manage all your booking from one place.</p>

                    {/* If the user is already logged in, you can show them a different message */}
                    {isLoggedIn ? (
                        <p>You are already logged in!</p>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>* Mobile Number</Form.Label>
                                <div className="formlogininput">
                                    <span className="leftinput"> +91</span>
                                    <Form.Control
                                        type="number"
                                        size="lg"
                                        className="logininput"
                                        placeholder="Enter your mobile number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                    />
                                </div>
                                <Form.Text className="text-muted">
                                    We ask your mobile phone number so we can send an SMS text or WhatsApp message as a backup to email. (We won't call you unless you ask us to!)
                                </Form.Text>
                            </Form.Group>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            {/* Show OTP sending status */}
                            {isSendingOtp ? (
                                <p>Sending OTP...</p>
                            ) : (
                                otpSentMessage && <p>{otpSentMessage}</p>
                            )}
                            <Button className="bookcombtn w-100 mt-0" type="submit" disabled={isSendingOtp}>
                                {isSendingOtp ? "Sending OTP..." : "Submit"}
                            </Button>
                        </Form>
                    )}

                    <div className="Orbtn">
                        <p>OR</p>
                    </div>

                    <div className="loginGoogleBtn" onClick={handleGoogleLogin}>
                        <img src={googliconimg} alt="" className="me-2" /> Login with Google
                    </div>

                    <div className="loginAgent">
                        <div><img src={agenticon} alt="" width={150} /></div>
                        <h5>Are you a travel agent associated with Virya wildlife tours- Vrruksh Eco stay?</h5>
                        <Link to='/agentlogin'>
                            <div className="agentbtn">Login as Travel agent</div>
                        </Link>
                    </div>
                </div>
            </div>
            <VerifyLoginModal verifyModalshow={verifyModalshow} setVerifyModalshow={setVerifyModalshow} mobileNumber={mobileNumber} />

            {showPhoneNumberModal && (
                <>
                    <div className="phoneNumberModalOverlay"></div>
                    <div className="phoneNumberModal">
                        <h4>Enter Your Phone Number</h4>
                        <Form.Group className="mb-3">
                            <div className="formlogininput">
                                <span className="leftinput"> +91</span>
                                <Form.Control
                                    type="tel"
                                    size="lg"
                                    className="logininput"
                                    placeholder="Enter your mobile number"
                                    value={mobileNumberGoogle}
                                    onChange={(e) => setMobileNumberGoogle(e.target.value)}
                                />
                            </div>
                        </Form.Group>
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        <Button className="bookcombtn w-100 mt-0" onClick={handlePhoneNumberSubmit}>
                            Submit
                        </Button>
                    </div>
                </>
            )}

        </>
    );
}

export default LoginModal;
