import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize the paymentDetails state to hold the passed data
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Ensure that location.state is defined and contains paymentDetails
    if (location.state && location.state.paymentDetails) {
      setPaymentDetails(location.state.paymentDetails);
    } else {
      console.log("No payment details found in the state");
    }
  }, [location.state]);

  const handleGoToProfile = () => {
    navigate("/dashboard");
  };

  console.log("On ThankYou page", paymentDetails);  // Debug to check if data is being passed

  return (
    <div>
      <MainHeader />
      <div className="thank-you-container" style={styles.container}>
        <h1 style={styles.heading}>Thank You!</h1>
        <p style={styles.message}>Your payment has been successfully processed.</p>

        {/* Display payment details if available */}
        {paymentDetails ? (
          <div style={styles.details}>
            <p><strong>Booking Amount:</strong> Rs {paymentDetails.amount}</p>
            <p><strong>Booking Status:</strong> {paymentDetails.status}</p>
            <p><strong>Order Id:</strong> {paymentDetails.orderId}</p>
            <p><strong>Transaction Id:</strong> {paymentDetails.transactionId}</p>
          </div>
        ) : (
          <p>No payment details available</p>
        )}

        <button style={styles.button} onClick={handleGoToProfile}>
          Go to Your Profile
        </button>
      </div>
      <MainFooter />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "85dvh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#555",
  },
  button: {
    backgroundColor: "#806A50",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  details: {
    marginBottom: "2rem",
    fontSize: "1rem",
    color: "#333",
  },
};

export default ThankYouPage;
