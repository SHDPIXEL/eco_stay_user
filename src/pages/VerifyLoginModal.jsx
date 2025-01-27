import React, { useState, useEffect,useContext } from "react";
import API from "../api";
import verifyOtp from "../assets/images/verifyOtp.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import agenticon from "../assets/images/agenticon.png";
import { AuthContext } from "../context/AuthContext";

const VerifyLoginModal = ({
  verifyModalshow,
  setVerifyModalshow,
  mobileNumber,
  setLoginModalshow,
}) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(120); // Start with 120 seconds (2 minutes)
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // To track if OTP has been sent before
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [resendMessage, setResendMessage] = useState("");
  const [otpVerifiedMessage, setOtpVerifiedMessage] = useState(""); // State for resend OTP message
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (verifyModalshow && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer <= 0) {
      setOtpExpired(true); // OTP expired after 2 minutes
    }
  }, [verifyModalshow, timer]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
  
    if (otpExpired) {
      setErrorMessage("OTP has expired. Please request a new one.");
      return;
    }
  
    try {
      const response = await API.post("/auth/user/verify-otp", {
        phoneNumber: mobileNumber, // Use phoneNumber from LoginModal
        otp,
      });
  
      if (response.status === 200) {
        const token = response.data.token; // Assuming the token is in response.data.token
        login(token, "user");
        setOtpVerifiedMessage("OTP Verified successfully!"); // Set success message
        setVerifyModalshow(false); // Close the modal after successful verification
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to verify OTP. Please try again."
      );
    }
  };

  const handleResendOtp = async () => {
    setResendMessage(""); // Clear previous resend message
    try {
      const response = await API.post("/auth/user/send-otp", {
        phoneNumber: mobileNumber,
      });

      if (response.status === 200) {
        setResendMessage("OTP sent again!"); // Set resend success message
        setOtpSent(true); // Mark OTP as sent
        setOtp(""); // Reset OTP field
        setOtpExpired(false); // Reset OTP expiration state
        setTimer(120); // Reset timer to 2 minutes
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <div
        className={
          verifyModalshow ? "overlayLoginModal d-block" : "overlayLoginModal"
        }
      ></div>
      <div
        className={verifyModalshow ? "rightAuthModal show" : "rightAuthModal"}
      >
        <div className="authmodal">
          <img src={verifyOtp} alt="Verify OTP" />
          <div
            className="AuthcloseIcon text-white"
            onClick={() => setVerifyModalshow(false)}
          >
            <i className="bi bi-x-circle-fill"></i>
          </div>
        </div>
        <div className="Authcontente">
          <h4>Verify your mobile number using OTP</h4>
          <p>
            Verify your mobile number using OTP. We have sent an SMS with
            6-digits OTP on your mobile number <span>+91 {mobileNumber}</span>.
          </p>

          {/* Show success message here */}
          {otpVerifiedMessage && <p className="text-success">{otpVerifiedMessage}</p>}

          <Form onSubmit={handleOtpSubmit}>
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
                  disabled={otpExpired} // Disable OTP input when expired
                />
              </div>
            </Form.Group>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Button
              className="bookcombtn w-100 mt-0 verifybtn"
              type="submit"
              disabled={otpExpired}
            >
              Verify OTP
            </Button>
          </Form>

          <div className="timeverify">
            {otpExpired ? "OTP Expired" : formatTime(timer)}{" "}
            {/* Display expiration timer */}
          </div>

          {/* Show resend OTP message here */}
          {resendMessage && <p className="text-success">{resendMessage}</p>}

          <div
            className="loginGoogleBtn resentbtn"
            onClick={handleResendOtp}
            disabled={otpExpired}
          >
            Didn’t get OTP? Resend OTP
          </div>

          <div className="loginAgent">
            <div>
              <img src={agenticon} alt="" width={150} />
            </div>
            <h5>
              Are you a travel agent associated with Virya wildlife tours-
              Vrruksh Eco stay?
            </h5>
            <div className="agentbtn">Login as Travel agent</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyLoginModal;
