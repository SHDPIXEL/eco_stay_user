import React, { useContext, useState, useEffect, use, useId } from "react";
import MainFooter from "./MainFooter";
import { Button, Nav, Form, Table, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import userimg from "../assets/images/dummy-user.png";
import API from "../api";

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const userType = localStorage.getItem("type");
  const [userId, setUserId] = useState("");

  const [selectedTab, setSelectedTab] = useState("profile");
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
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [nightlyBreakups, setNightlyBreakups] = useState(null);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (profileData.u_id) {
      setUserId(profileData.u_id);
    }
  }, [profileData.u_id]);

  useEffect(() => {
    if (selectedTab === "profile") fetchUserData();
    if (selectedTab === "upcomingBookings") fetchUpcomingBookings();
    if (selectedTab === "pastBookings") fetchPastBookings();
    if (selectedTab === "paymentHistory") fetchPaymentHistory();
    if (selectedTab === "nightlybreakup") fetchnightlybreakup();
    fetchPaymentHistory();
  }, [selectedTab, profileData.u_id]); // Add profileData.u_id as a dependency to trigger on change

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/booking-details");
      const bookings = response.data;

      // Filter bookings into upcoming and past based on status
      const upcoming = bookings.filter(
        (booking) => booking.status === "pending"
      );
      const past = bookings.filter((booking) => booking.status !== "pending");

      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // const fetchPaymentHistory = async () => {
  //   try {
  //     const response = await API.get("/payments/payment");
  //     setPaymentHistory(Array.isArray(response.data.payments) ? response.data.payments : []);
  //   } catch (error) {
  //     console.error("Error fetching payment history:", error);
  //     setPaymentHistory([]);
  //   }
  // };

  const fetchPaymentHistory = async () => {
    try {
      const endPoint =
        userType === "agent"
          ? `/payments/payment/agent/${userId}`
          : `/payments/payment/user/${userId}`;

      const response = await API.get(endPoint);
      setPaymentHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setPaymentHistory([]);
    }
  };

  const fetchUpcomingBookings = async () => {
    try {
      const endPoint =
        userType === "agent"
          ? `/bookings/booking-details/agent/${userId}`
          : `/bookings/booking-details/user/${userId}`;

      const response = await API.get(endPoint);
      // console.log("Upcoming booking data:", response.data);

      const today = new Date(); // Get today's date without time
      today.setHours(0, 0, 0, 0);

      const upcoming = response.data.filter((booking) => {
        const checkInDate = new Date(booking.checkInDate);
        checkInDate.setHours(0, 0, 0, 0); // Normalize to compare only dates
        return checkInDate > today; // Future bookings
      });

      setUpcomingBookings(upcoming);
      // console.log("Filtered upcoming data:", upcoming);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
    }
  };

  const fetchPastBookings = async () => {
    try {
      // console.log("User ID:", userId);
      const endPoint =
        userType === "agent"
          ? `/bookings/booking-details/agent/${userId}`
          : `/bookings/booking-details/user/${userId}`;

      const response = await API.get(endPoint);
      // console.log("Past booking data:", response.data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const past = response.data.filter((booking) => {
        const checkInDate = new Date(booking.checkInDate);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate <= today; // Today or past bookings
      });

      setPastBookings(past);
      // console.log("Filtered past data:", past);
    } catch (error) {
      console.error("Error fetching past bookings:", error);
    }
  };

  const fetchnightlybreakup = async () => {
    try {
      const endPoint =
        userType === "agent"
          ? `/bookings/booking-details/agent/${userId}`
          : `/bookings/booking-details/user/${userId}`;

      const response = await API.get(endPoint);

      console.log("Response data:", response.data);

      // Iterate over the response data (which contains multiple bookings)
      const breakups = response.data.map((booking) => {
        return {
          bookingId: booking.booking_id, // Extract booking_id
          nightlyBreakups: booking.nightly_breakup, // Extract nightly_breakup
        };
      });

      console.log("Nightly Breakups for All Bookings:", breakups);

      // Set all the breakups data to the state
      setNightlyBreakups(breakups);
    } catch (error) {
      console.error("Error fetching nightly breakup:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Assuming your API route expects a `u_id` to fetch user data;
      const endPoint =
        userType === "agent"
          ? "/auth/agent/agent-data"
          : "/auth/user/user-data";
      const response = await API.post(endPoint); // Fetch based on u_id
      setProfileData(response.data);
      setUserId(response.data.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    // API request to update profile
    const endpoint = userType === "agent" ? "/agents/agent" : "/users/user";
    API.put(endpoint, profileData)
      .then(() => {
        setMessage("Profile updated successfully!");
      })
      .catch((error) => {
        setMessage("Error updating profile. Please try again.");
        console.error("Error updating profile:", error);
      });
  };

  const tabContent = {
    profile: (
      <Form onSubmit={handleProfileUpdate}>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
          }}
        >
          {userType === "agent" ? "Agent Profile" : "User Profile"}
        </span>

        <Row className="mb-3">
          <Col md={6}>
            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formUId"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label
                    style={{
                      width: "50%",
                      alignContent: "start",
                      justifyContent: "start",
                    }}
                  >
                    User ID:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.u_id}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formName"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Name:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.name}
                    placeholder="Enter Your Name"
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
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
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Phone:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    readOnly
                    disabled
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
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Address:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.address}
                    placeholder="Ener Your Address"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
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
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    City:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.city}
                    placeholder="Enter Your City"
                    onChange={(e) =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
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
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    State:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.state}
                    placeholder="Enter Your State"
                    onChange={(e) =>
                      setProfileData({ ...profileData, state: e.target.value })
                    }
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
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Country:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.country}
                    placeholder="Enter Your Country"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        country: e.target.value,
                      })
                    }
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
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Pincode:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.pincode}
                    placeholder="Enter Your Pincode"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        pincode: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        {message && (
          <div style={{ marginBottom: "20px", color: "green" }}>{message}</div>
        )}
        <Button variant="primary" type="submit" className="update-btn">
          Update Profile
        </Button>
      </Form>
    ),
    upcomingBookings: (
      <>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
            justifyContent: "center",
          }}
        >
          Upcoming Bookings
        </span>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Booking Id</th>
              <th>Check IN</th>
              <th>Check-Out </th>
              <th>Status</th>
              {userType === "agent" ? <th>Phone</th> : ""}
              <th>Amount(Rs)</th>
            </tr>
          </thead>
          <tbody>
            {upcomingBookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              upcomingBookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.booking_id}</td>
                  <td>{booking.checkInDate}</td>
                  <td>{booking.checkOutDate}</td>
                  <td
                    className={
                      booking.status === "confirmed"
                        ? "status-confirmed"
                        : "status-not-confirmed"
                    }
                  >
                    {booking.status}
                  </td>
                  {userType === "agent" ? <td>{booking.customerPhone}</td> : ""}
                  <td>{booking.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </>
    ),
    pastBookings: (
      <>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
            justifyContent: "center",
          }}
        >
          Past Bookings
        </span>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Booking Id</th>
              <th>Check IN</th>
              <th>Check-Out </th>
              <th>Status</th>
              {userType === "agent" ? <th>Phone</th> : ""}
              <th>Amount(Rs)</th>
            </tr>
          </thead>
          <tbody>
            {pastBookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              pastBookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.booking_id}</td>
                  <td>{booking.checkInDate}</td>
                  <td>{booking.checkOutDate}</td>
                  <td
                    className={
                      booking.status === "confirmed"
                        ? "status-confirmed"
                        : "status-not-confirmed"
                    }
                  >
                    {booking.status}
                  </td>
                  {userType === "agent" ? <td>{booking.customerPhone}</td> : ""}
                  <td>{booking.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </>
    ),
    paymentHistory: (
      <>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
            justifyContent: "center",
          }}
        >
          Payment History
        </span>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Transaction ID</th>
              <th>Order Id</th>
              <th>Amount(Rs)</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              paymentHistory.map((payment, index) => (
                <tr key={payment.id}>
                  <td>{index + 1}</td>
                  <td>{payment.transactionId}</td>
                  <td>{payment.orderId}</td>
                  <td>{payment.amount}</td>
                  {/* <td>{payment.paymentDate}</td> */}
                  <td>
                    {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </td>
                  <td
                    className={
                      payment.status === "success"
                        ? "status-confirmed"
                        : "status-not-confirmed"
                    }
                  >
                    {payment.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </>
    ),
    nightlybreakup: (
      <>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
            justifyContent: "center",
          }}
        >
          Nightly BreakUp of Cottages
        </span>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Booking Id</th>
              <th>Details</th>
              <th>Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {nightlyBreakups && nightlyBreakups.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No nightly breakup found
                </td>
              </tr>
            ) : (
              (nightlyBreakups || []).map((breakup, index) => {
                let parsedBreakups = [];

                try {
                  parsedBreakups = JSON.parse(breakup.nightlyBreakups);
                } catch (err) {
                  console.error(
                    "Failed to parse nightlyBreakups",
                    breakup.nightlyBreakups
                  );
                  return null;
                }

                return parsedBreakups.map((details, idx) => {
                  const [cottageInfo, dateInfo, amountInfo] =
                    details.split("\n");

                  const numberOfCottages = cottageInfo.split(" ")[0];
                  const nightInfo = cottageInfo.split("X")[1]?.trim();
                  const date = dateInfo.split("(")[0]?.trim();
                  const amount = amountInfo?.trim();

                  return (
                    <tr key={`${breakup.bookingId}-${idx}`}>
                      {idx === 0 && (
                        <td
                          rowSpan={breakup.nightlyBreakups.length}
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {breakup.bookingId}
                        </td>
                      )}
                      <td>{`${numberOfCottages} Cottages, ${nightInfo}, Date: ${date}`}</td>
                      <td>{amount}</td>
                    </tr>
                  );
                });
              })
            )}
          </tbody>
        </Table>
      </>
    ),
  };

  return (
    <>
      <section className="userpanel">
        <div className="container-fluid mt-5 mb-4">
          <div className="logout-btn-container">
            {userType === "agent" ? (
              <div className="agent-title">Agent Login</div>
            ) : (
              <div></div>
            )}
            <Nav.Link
              to="/login"
              onClick={handleLogout}
              className="logout-btn popbg"
            >
              Logout
            </Nav.Link>
          </div>
          <div className="row mt-2">
            <div className="col-lg-3 mt-4">
              <div className="bookcomfortbox popbg user-details">
                <div className="user-info text-center mb-4">
                  <img
                    src={userimg}
                    alt="User"
                    className="user-image mb-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                  <h5 className="user-name">{profileData.name}</h5>
                </div>
                <ul className="user-menu list-unstyled">
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("profile")}
                    >
                      Profile
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("upcomingBookings")}
                    >
                      Upcoming Bookings
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("pastBookings")}
                    >
                      Past Bookings
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("paymentHistory")}
                    >
                      Payment History
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("nightlybreakup")}
                    >
                      Nightly BreakUp of Cottages
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9 mt-4">
              <div className="bookcomfortbox">{tabContent[selectedTab]}</div>
            </div>
          </div>
        </div>
      </section>
      <MainFooter />
    </>
  );
};

export default UserDashboard;
